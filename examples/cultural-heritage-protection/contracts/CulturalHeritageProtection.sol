// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint32, euint64, ebool } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract CulturalHeritageProtection is SepoliaConfig {

    address public curator;
    uint32 public totalArtifacts;

    struct HeritageArtifact {
        euint32 encryptedId;
        euint64 encryptedValue;
        euint32 encryptedAge;
        ebool isAuthentic;
        bool isActive;
        address owner;
        uint256 timestamp;
        string category;
    }

    struct AccessRecord {
        address accessor;
        uint256 accessTime;
        string purpose;
        bool approved;
    }

    mapping(uint32 => HeritageArtifact) public artifacts;
    mapping(uint32 => mapping(address => bool)) public authorizedViewers;
    mapping(uint32 => AccessRecord[]) public accessHistory;
    mapping(address => bool) public certifiedExperts;

    event ArtifactRegistered(uint32 indexed artifactIndex, address indexed owner, string category);
    event AccessGranted(uint32 indexed artifactIndex, address indexed viewer, string purpose);
    event AccessRevoked(uint32 indexed artifactIndex, address indexed viewer);
    event AuthenticityVerified(uint32 indexed artifactIndex, bool authentic);
    event ExpertCertified(address indexed expert, bool certified);

    modifier onlyCurator() {
        require(msg.sender == curator, "Not authorized curator");
        _;
    }

    modifier onlyAuthorized(uint32 _artifactIndex) {
        require(
            msg.sender == artifacts[_artifactIndex].owner ||
            authorizedViewers[_artifactIndex][msg.sender] ||
            certifiedExperts[msg.sender],
            "Not authorized to view artifact"
        );
        _;
    }

    modifier onlyExpert() {
        require(certifiedExperts[msg.sender], "Not a certified expert");
        _;
    }

    constructor() {
        curator = msg.sender;
        totalArtifacts = 0;
    }

    function registerArtifact(
        uint32 _id,
        uint64 _value,
        uint32 _age,
        bool _isAuthentic,
        string memory _category
    ) external {
        require(_id > 0, "Invalid artifact ID");
        require(bytes(_category).length > 0, "Category required");

        euint32 encryptedId = FHE.asEuint32(_id);
        euint64 encryptedValue = FHE.asEuint64(_value);
        euint32 encryptedAge = FHE.asEuint32(_age);
        ebool isAuthentic = FHE.asEbool(_isAuthentic);

        artifacts[totalArtifacts] = HeritageArtifact({
            encryptedId: encryptedId,
            encryptedValue: encryptedValue,
            encryptedAge: encryptedAge,
            isAuthentic: isAuthentic,
            isActive: true,
            owner: msg.sender,
            timestamp: block.timestamp,
            category: _category
        });

        FHE.allowThis(encryptedId);
        FHE.allowThis(encryptedValue);
        FHE.allowThis(encryptedAge);
        FHE.allowThis(isAuthentic);

        FHE.allow(encryptedId, msg.sender);
        FHE.allow(encryptedValue, msg.sender);
        FHE.allow(encryptedAge, msg.sender);
        FHE.allow(isAuthentic, msg.sender);

        emit ArtifactRegistered(totalArtifacts, msg.sender, _category);
        totalArtifacts++;
    }

    function grantAccess(
        uint32 _artifactIndex,
        address _viewer,
        string memory _purpose
    ) external {
        require(_artifactIndex < totalArtifacts, "Artifact does not exist");
        require(
            msg.sender == artifacts[_artifactIndex].owner ||
            msg.sender == curator,
            "Not authorized to grant access"
        );
        require(_viewer != address(0), "Invalid viewer address");
        require(bytes(_purpose).length > 0, "Purpose required");

        authorizedViewers[_artifactIndex][_viewer] = true;

        accessHistory[_artifactIndex].push(AccessRecord({
            accessor: _viewer,
            accessTime: block.timestamp,
            purpose: _purpose,
            approved: true
        }));

        HeritageArtifact storage artifact = artifacts[_artifactIndex];
        FHE.allow(artifact.encryptedId, _viewer);
        FHE.allow(artifact.encryptedValue, _viewer);
        FHE.allow(artifact.encryptedAge, _viewer);
        FHE.allow(artifact.isAuthentic, _viewer);

        emit AccessGranted(_artifactIndex, _viewer, _purpose);
    }

    function revokeAccess(uint32 _artifactIndex, address _viewer) external {
        require(_artifactIndex < totalArtifacts, "Artifact does not exist");
        require(
            msg.sender == artifacts[_artifactIndex].owner ||
            msg.sender == curator,
            "Not authorized to revoke access"
        );

        authorizedViewers[_artifactIndex][_viewer] = false;

        emit AccessRevoked(_artifactIndex, _viewer);
    }

    function verifyAuthenticity(uint32 _artifactIndex) external onlyExpert {
        require(_artifactIndex < totalArtifacts, "Artifact does not exist");

        bytes32[] memory cts = new bytes32[](1);
        cts[0] = FHE.toBytes32(artifacts[_artifactIndex].isAuthentic);
        FHE.requestDecryption(cts, this.processAuthenticityResult.selector);
    }

    function processAuthenticityResult(
        uint256 requestId,
        bytes memory cleartexts,
        bytes memory decryptionProof
    ) external {
        FHE.checkSignatures(requestId, cleartexts, decryptionProof);

        bool authentic = abi.decode(cleartexts, (bool));

        uint32 artifactIndex = uint32(requestId % totalArtifacts);

        emit AuthenticityVerified(artifactIndex, authentic);
    }

    function certifyExpert(address _expert, bool _certified) external onlyCurator {
        require(_expert != address(0), "Invalid expert address");

        certifiedExperts[_expert] = _certified;

        emit ExpertCertified(_expert, _certified);
    }

    function getArtifactInfo(uint32 _artifactIndex) external view onlyAuthorized(_artifactIndex) returns (
        bool isActive,
        address owner,
        uint256 timestamp,
        string memory category
    ) {
        require(_artifactIndex < totalArtifacts, "Artifact does not exist");

        HeritageArtifact storage artifact = artifacts[_artifactIndex];
        return (
            artifact.isActive,
            artifact.owner,
            artifact.timestamp,
            artifact.category
        );
    }

    function getAccessHistory(uint32 _artifactIndex) external view returns (
        address[] memory accessors,
        uint256[] memory accessTimes,
        string[] memory purposes,
        bool[] memory approvals
    ) {
        require(_artifactIndex < totalArtifacts, "Artifact does not exist");
        require(
            msg.sender == artifacts[_artifactIndex].owner ||
            msg.sender == curator ||
            certifiedExperts[msg.sender],
            "Not authorized to view access history"
        );

        AccessRecord[] storage records = accessHistory[_artifactIndex];
        uint256 length = records.length;

        accessors = new address[](length);
        accessTimes = new uint256[](length);
        purposes = new string[](length);
        approvals = new bool[](length);

        for (uint256 i = 0; i < length; i++) {
            accessors[i] = records[i].accessor;
            accessTimes[i] = records[i].accessTime;
            purposes[i] = records[i].purpose;
            approvals[i] = records[i].approved;
        }

        return (accessors, accessTimes, purposes, approvals);
    }

    function isAuthorizedViewer(uint32 _artifactIndex, address _viewer) external view returns (bool) {
        require(_artifactIndex < totalArtifacts, "Artifact does not exist");

        return authorizedViewers[_artifactIndex][_viewer] ||
               _viewer == artifacts[_artifactIndex].owner ||
               certifiedExperts[_viewer];
    }

    function getTotalArtifacts() external view returns (uint32) {
        return totalArtifacts;
    }

    function transferOwnership(uint32 _artifactIndex, address _newOwner) external {
        require(_artifactIndex < totalArtifacts, "Artifact does not exist");
        require(msg.sender == artifacts[_artifactIndex].owner, "Only owner can transfer");
        require(_newOwner != address(0), "Invalid new owner");

        artifacts[_artifactIndex].owner = _newOwner;

        HeritageArtifact storage artifact = artifacts[_artifactIndex];
        FHE.allow(artifact.encryptedId, _newOwner);
        FHE.allow(artifact.encryptedValue, _newOwner);
        FHE.allow(artifact.encryptedAge, _newOwner);
        FHE.allow(artifact.isAuthentic, _newOwner);
    }

    function deactivateArtifact(uint32 _artifactIndex) external {
        require(_artifactIndex < totalArtifacts, "Artifact does not exist");
        require(
            msg.sender == artifacts[_artifactIndex].owner ||
            msg.sender == curator,
            "Not authorized to deactivate"
        );

        artifacts[_artifactIndex].isActive = false;
    }

    function reactivateArtifact(uint32 _artifactIndex) external {
        require(_artifactIndex < totalArtifacts, "Artifact does not exist");
        require(
            msg.sender == artifacts[_artifactIndex].owner ||
            msg.sender == curator,
            "Not authorized to reactivate"
        );

        artifacts[_artifactIndex].isActive = true;
    }
}