import fsExtra from "fs-extra";
import path from "path";

async function main() {
  const sourceDir = path.join(__dirname, "./../typechain");
  const destinationDir = path.join(__dirname, "./../../src/constants/types");
  console.log({ sourceDir, destinationDir });

  console.log(" Copying typechain ... ");
  fsExtra.copySync(sourceDir, destinationDir, {
    overwrite: true,
    recursive: true,
  });
  console.log(" Copy to frontend Success ");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
