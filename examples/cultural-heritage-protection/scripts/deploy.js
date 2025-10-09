const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting Cultural Heritage Protection deployment...\n");

  // Get network information
  const network = await ethers.provider.getNetwork();
  console.log(`📡 Network: ${network.name} (Chain ID: ${network.chainId})`);

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log(`👤 Deployer address: ${deployer.address}`);

  // Check deployer balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`💰 Deployer balance: ${ethers.formatEther(balance)} ETH\n`);

  if (balance === 0n) {
    throw new Error("❌ Deployer account has no funds!");
  }

  // Deploy the contract
  console.log("📄 Deploying CulturalHeritageProtection contract...");
  const CulturalHeritageProtection = await ethers.getContractFactory(
    "CulturalHeritageProtection"
  );

  const contract = await CulturalHeritageProtection.deploy();
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log(`✅ Contract deployed to: ${contractAddress}\n`);

  // Get deployment transaction details
  const deploymentTx = contract.deploymentTransaction();
  if (deploymentTx) {
    console.log(`📝 Deployment Transaction Hash: ${deploymentTx.hash}`);

    // Wait for confirmation
    const receipt = await deploymentTx.wait(1);
    console.log(`⛽ Gas used: ${receipt.gasUsed.toString()}`);
    console.log(`🔢 Block number: ${receipt.blockNumber}\n`);
  }

  // Verify initial state
  console.log("🔍 Verifying contract state...");
  const curator = await contract.curator();
  const totalArtifacts = await contract.totalArtifacts();

  console.log(`👨‍💼 Curator address: ${curator}`);
  console.log(`📊 Total artifacts: ${totalArtifacts}\n`);

  // Save deployment information
  const deploymentInfo = {
    network: network.name,
    chainId: Number(network.chainId),
    contractAddress: contractAddress,
    deployer: deployer.address,
    curator: curator,
    deploymentTxHash: deploymentTx ? deploymentTx.hash : null,
    blockNumber: deploymentTx ? (await deploymentTx.wait(1)).blockNumber : null,
    timestamp: new Date().toISOString(),
    etherscanUrl: getEtherscanUrl(network.chainId, contractAddress),
  };

  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentFile = path.join(
    deploymentsDir,
    `${network.name}-deployment.json`
  );
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));

  console.log(`💾 Deployment info saved to: ${deploymentFile}`);
  console.log(`🔗 Etherscan: ${deploymentInfo.etherscanUrl}\n`);

  // Print next steps
  console.log("📋 Next Steps:");
  console.log("1. Verify contract on Etherscan:");
  console.log(`   npm run verify\n`);
  console.log("2. Interact with the contract:");
  console.log(`   npm run interact\n`);
  console.log("3. Run simulation tests:");
  console.log(`   npm run simulate\n`);

  console.log("✨ Deployment completed successfully!");
}

function getEtherscanUrl(chainId, address) {
  const chainIdNum = Number(chainId);
  switch (chainIdNum) {
    case 1:
      return `https://etherscan.io/address/${address}`;
    case 11155111:
      return `https://sepolia.etherscan.io/address/${address}`;
    case 5:
      return `https://goerli.etherscan.io/address/${address}`;
    default:
      return `https://etherscan.io/address/${address}`;
  }
}

// Error handling
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
