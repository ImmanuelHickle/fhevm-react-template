const { run } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🔍 Starting contract verification on Etherscan...\n");

  // Get network information
  const network = await hre.ethers.provider.getNetwork();
  console.log(`📡 Network: ${network.name} (Chain ID: ${network.chainId})`);

  // Load deployment information
  const deploymentFile = path.join(
    __dirname,
    "..",
    "deployments",
    `${network.name}-deployment.json`
  );

  if (!fs.existsSync(deploymentFile)) {
    throw new Error(
      `❌ Deployment file not found: ${deploymentFile}\nPlease run deployment first: npm run deploy`
    );
  }

  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
  const contractAddress = deploymentInfo.contractAddress;

  console.log(`📄 Contract address: ${contractAddress}`);
  console.log(`🔗 Etherscan URL: ${deploymentInfo.etherscanUrl}\n`);

  // Verify the contract
  console.log("⏳ Verifying contract on Etherscan...");
  console.log("This may take a few moments...\n");

  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: [],
    });

    console.log("✅ Contract verified successfully!\n");
    console.log(`🔗 View on Etherscan: ${deploymentInfo.etherscanUrl}`);

    // Update deployment info with verification status
    deploymentInfo.verified = true;
    deploymentInfo.verifiedAt = new Date().toISOString();
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));

    console.log(`💾 Deployment info updated with verification status\n`);
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("ℹ️  Contract is already verified on Etherscan");
      console.log(`🔗 View on Etherscan: ${deploymentInfo.etherscanUrl}\n`);

      // Update deployment info
      deploymentInfo.verified = true;
      fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
    } else {
      throw error;
    }
  }

  console.log("✨ Verification process completed!");
}

// Error handling
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Verification failed:");
    console.error(error.message);

    if (error.message.includes("ETHERSCAN_API_KEY")) {
      console.error(
        "\n💡 Tip: Make sure ETHERSCAN_API_KEY is set in your .env file"
      );
    }

    process.exit(1);
  });
