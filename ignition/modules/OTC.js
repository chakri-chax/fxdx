const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("OTCModule",  (m) => {
  const OTC = m.contract("OTC", []);
  return { OTC };
});
