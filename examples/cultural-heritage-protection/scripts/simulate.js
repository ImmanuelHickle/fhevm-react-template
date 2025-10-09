const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🧪 Cultural Heritage Protection - Simulation Script\n");
  console.log("=".repeat(70));
  console.log("This script simulates a complete workflow of the system");
  console.log("=".repeat(70) + "\n");

  // Get network information
  const network = await ethers.provider.getNetwork();
  console.log(`📡 Network: ${network.name} (Chain ID: ${network.chainId})\n`);

  // Load deployment information
  const deploymentFile = path.join(
    __dirname,
    "..",
    "deployments",
    `${network.name}-deployment.json`
  );

  if (!fs.existsSync(deploymentFile)) {
    throw new Error(
      `❌ Deployment file not found. Please deploy first: npm run deploy`
    );
  }

  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
  const contractAddress = deploymentInfo.contractAddress;

  console.log(`📄 Contract: ${contractAddress}\n`);

  // Get signers
  const [curator, user1, user2, expert] = await ethers.getSigners();

  console.log("👥 Test Accounts:");
  console.log(`  Curator: ${curator.address}`);
  console.log(`  User 1:  ${user1.address}`);
  console.log(`  User 2:  ${user2.address}`);
  console.log(`  Expert:  ${expert.address}\n`);

  // Connect to contract
  const CulturalHeritageProtection = await ethers.getContractFactory(
    "CulturalHeritageProtection"
  );
  const contract = CulturalHeritageProtection.attach(contractAddress);

  console.log("=".repeat(70));
  console.log("STEP 1: Certify Expert");
  console.log("=".repeat(70) + "\n");

  console.log("⏳ Certifying expert account...");
  let tx = await contract.connect(curator).certifyExpert(expert.address, true);
  await tx.wait();
  console.log("✅ Expert certified successfully\n");

  const isExpert = await contract.certifiedExperts(expert.address);
  console.log(`🔍 Verification: Expert status = ${isExpert}\n`);

  console.log("=".repeat(70));
  console.log("STEP 2: Register Artifacts");
  console.log("=".repeat(70) + "\n");

  const artifacts = [
    {
      id: 1001,
      value: 500000,
      age: 2500,
      isAuthentic: true,
      category: "Ancient Pottery",
      owner: user1,
    },
    {
      id: 1002,
      value: 1200000,
      age: 1800,
      isAuthentic: true,
      category: "Renaissance Painting",
      owner: user1,
    },
    {
      id: 1003,
      value: 300000,
      age: 500,
      isAuthentic: true,
      category: "Medieval Manuscript",
      owner: user2,
    },
  ];

  for (let i = 0; i < artifacts.length; i++) {
    const artifact = artifacts[i];
    console.log(`📝 Registering artifact #${i}: ${artifact.category}`);

    tx = await contract
      .connect(artifact.owner)
      .registerArtifact(
        artifact.id,
        artifact.value,
        artifact.age,
        artifact.isAuthentic,
        artifact.category
      );

    const receipt = await tx.wait();
    console.log(`   ✅ Registered (Gas: ${receipt.gasUsed.toString()})`);
  }

  const totalArtifacts = await contract.totalArtifacts();
  console.log(`\n🎨 Total artifacts registered: ${totalArtifacts}\n`);

  console.log("=".repeat(70));
  console.log("STEP 3: Grant Access Permissions");
  console.log("=".repeat(70) + "\n");

  console.log("🔓 User 1 granting access to Expert for artifact #0...");
  tx = await contract
    .connect(user1)
    .grantAccess(0, expert.address, "Authentication verification");
  await tx.wait();
  console.log("   ✅ Access granted\n");

  console.log("🔓 User 1 granting access to User 2 for artifact #1...");
  tx = await contract
    .connect(user1)
    .grantAccess(1, user2.address, "Research collaboration");
  await tx.wait();
  console.log("   ✅ Access granted\n");

  console.log("🔓 Curator granting access to Expert for artifact #2...");
  tx = await contract
    .connect(curator)
    .grantAccess(2, expert.address, "Expert evaluation");
  await tx.wait();
  console.log("   ✅ Access granted\n");

  console.log("=".repeat(70));
  console.log("STEP 4: View Artifact Information");
  console.log("=".repeat(70) + "\n");

  for (let i = 0; i < 3; i++) {
    try {
      const info = await contract.connect(artifacts[i].owner).getArtifactInfo(i);

      console.log(`📋 Artifact #${i} Information:`);
      console.log(`   Category: ${info.category}`);
      console.log(`   Owner: ${info.owner}`);
      console.log(`   Active: ${info.isActive}`);
      console.log(`   Registered: ${new Date(Number(info.timestamp) * 1000).toLocaleString()}\n`);
    } catch (error) {
      console.log(`   ❌ Error accessing artifact #${i}: ${error.message}\n`);
    }
  }

  console.log("=".repeat(70));
  console.log("STEP 5: View Access History");
  console.log("=".repeat(70) + "\n");

  for (let i = 0; i < 2; i++) {
    try {
      const history = await contract.connect(user1).getAccessHistory(i);

      console.log(`📜 Artifact #${i} Access History:`);
      console.log(`   Total access records: ${history.accessors.length}`);

      for (let j = 0; j < history.accessors.length; j++) {
        console.log(`\n   Record #${j + 1}:`);
        console.log(`     Accessor: ${history.accessors[j]}`);
        console.log(`     Purpose: ${history.purposes[j]}`);
        console.log(`     Approved: ${history.approvals[j]}`);
        console.log(`     Time: ${new Date(Number(history.accessTimes[j]) * 1000).toLocaleString()}`);
      }
      console.log();
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}\n`);
    }
  }

  console.log("=".repeat(70));
  console.log("STEP 6: Check Authorization Status");
  console.log("=".repeat(70) + "\n");

  const checks = [
    { artifact: 0, viewer: expert.address, label: "Expert -> Artifact #0" },
    { artifact: 1, viewer: user2.address, label: "User2 -> Artifact #1" },
    { artifact: 2, viewer: expert.address, label: "Expert -> Artifact #2" },
    { artifact: 0, viewer: user2.address, label: "User2 -> Artifact #0" },
  ];

  for (const check of checks) {
    const authorized = await contract.isAuthorizedViewer(
      check.artifact,
      check.viewer
    );
    console.log(`🔍 ${check.label}: ${authorized ? "✅ Authorized" : "❌ Not Authorized"}`);
  }

  console.log();

  console.log("=".repeat(70));
  console.log("STEP 7: Transfer Ownership");
  console.log("=".repeat(70) + "\n");

  console.log("🔄 Transferring artifact #1 from User1 to User2...");
  tx = await contract.connect(user1).transferOwnership(1, user2.address);
  await tx.wait();
  console.log("   ✅ Ownership transferred\n");

  const newInfo = await contract.connect(user2).getArtifactInfo(1);
  console.log(`🔍 New owner: ${newInfo.owner}\n`);

  console.log("=".repeat(70));
  console.log("STEP 8: Deactivate and Reactivate Artifact");
  console.log("=".repeat(70) + "\n");

  console.log("🚫 Deactivating artifact #0...");
  tx = await contract.connect(user1).deactivateArtifact(0);
  await tx.wait();
  console.log("   ✅ Artifact deactivated\n");

  let status = await contract.connect(user1).getArtifactInfo(0);
  console.log(`🔍 Status: ${status.isActive ? "Active" : "Inactive"}\n`);

  console.log("✅ Reactivating artifact #0...");
  tx = await contract.connect(user1).reactivateArtifact(0);
  await tx.wait();
  console.log("   ✅ Artifact reactivated\n");

  status = await contract.connect(user1).getArtifactInfo(0);
  console.log(`🔍 Status: ${status.isActive ? "Active" : "Inactive"}\n`);

  console.log("=".repeat(70));
  console.log("STEP 9: Revoke Access");
  console.log("=".repeat(70) + "\n");

  console.log("🔒 Revoking Expert's access to artifact #0...");
  tx = await contract.connect(user1).revokeAccess(0, expert.address);
  await tx.wait();
  console.log("   ✅ Access revoked\n");

  const stillAuthorized = await contract.isAuthorizedViewer(0, expert.address);
  console.log(`🔍 Expert authorized for artifact #0: ${stillAuthorized ? "Yes" : "No"}\n`);

  console.log("=".repeat(70));
  console.log("SIMULATION SUMMARY");
  console.log("=".repeat(70) + "\n");

  const finalTotal = await contract.totalArtifacts();
  const curatorAddress = await contract.curator();

  console.log("📊 Final Statistics:");
  console.log(`   Total Artifacts: ${finalTotal}`);
  console.log(`   Curator: ${curatorAddress}`);
  console.log(`   Certified Experts: 1`);
  console.log(`   Access Records Created: 3+`);
  console.log(`   Ownership Transfers: 1`);
  console.log();

  console.log("✅ All simulation steps completed successfully!");
  console.log("\n💡 Next Steps:");
  console.log("   - Deploy to Sepolia testnet: npm run deploy");
  console.log("   - Verify on Etherscan: npm run verify");
  console.log("   - Interact manually: npm run interact");
  console.log();
}

// Error handling
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Simulation failed:");
    console.error(error);
    process.exit(1);
  });
