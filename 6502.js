/* 6502.js runs as a web worker thread controlling
the perfect6502 wasm simulation */
const BIT = 0;
const BIT_INV = 1;
const BYTE_ = 2;
const BYTE_INV = 3;
const signal_list = [
  ["clk1", 1163, BIT],
  ["clk2", 421, BIT],
  ["t0", 1536, BIT_INV],
  ["t1", 156, BIT_INV],
  ["t2", 971, BIT_INV],
  ["t3", 1567, BIT_INV],
  ["t4", 690, BIT_INV],
  ["t5", 909, BIT_INV],
  ["status_c", 32, BIT],
  ["status_z", 627, BIT],
  ["status_i", 1553, BIT],
  ["status_d", 348, BIT],
  ["status_b", 1119, BIT],
  ["status_v", 1625, BIT],
  ["status_n", 69, BIT],
  ["tzpre", 792, BIT_INV],
  ["dl_db", 863, BIT],
  ["dl_adl", 1564, BIT],
  ["dl_adh", 41, BIT],
  ["n0_adh0", 229, BIT],
  ["n0_adh1-7", 203, BIT],
  ["adh_abh", 821, BIT],
  ["adl_abl", 639, BIT],
  ["pcl_pcl", 898, BIT],
  ["adl_pcl", 414, BIT],
  ["i_pc", 379, BIT_INV],
  ["pcl_db", 283, BIT],
  ["pcl_adl", 438, BIT],
  ["pch_pch", 741, BIT],
  ["adh_pch", 48, BIT],
  ["pch_db", 247, BIT],
  ["pch_adh", 1235, BIT],
  ["sb_adh", 140, BIT],
  ["sb_db", 1060, BIT],
  ["s_adl", 1468, BIT],
  ["sb_s", 874, BIT],
  ["s_s", 654, BIT],
  ["s_sb", 1700, BIT],
  ["sb_ac", 534, BIT],
  ["ac_db", 1331, BIT],
  ["ac_sb", 1698, BIT],
  ["sb_x", 1186, BIT],
  ["x_sb", 1263, BIT],
  ["sb_y", 325, BIT],
  ["y_sb", 801, BIT],
  ["dbinv_add", 1068, BIT],
  ["db_add", 859, BIT],
  ["adl_add", 437, BIT],
  ["daa", 1201, BIT_INV],
  ["dsa", 725, BIT_INV],
  ["n1_addc", 1165, BIT_INV],
  ["sums", 921, BIT],
  ["ands", 574, BIT],
  ["eors", 1666, BIT],
  ["ors", 59, BIT],
  ["srs", 362, BIT],
  ["add_adl", 1015, BIT],
  ["add_sb0-6", 129, BIT],
  ["add_sb7", 214, BIT],
  ["n0_add", 984, BIT],
  ["sb_add", 549, BIT],
  ["p_db", 1042, BIT],
  ["db0_c", 507, BIT],
  ["ir5_c", 253, BIT],
  ["acr_c", 954, BIT],
  ["db7_n", 754, BIT],
  ["dbz_z", 755, BIT],
  ["ir5_i", 1662, BIT],
  ["ir5_d", 1492, BIT],
  ["db6_v", 1111, BIT],
  ["avr_v", 1436, BIT],
  ["n1_v", 1177, BIT],
  ["n0_v", 587, BIT],
  ["db_p", 781, BIT],
  ["write", 1156, BIT_INV],
  ["read", 1156, BIT],
  ["RW", 1156, BIT],
  ["pclc", 1704, BIT],
  ["clk1_adl_abl", [1163,639], BIT],
  ["clk1_adh_abh", [1163,821], BIT],
  ["load_ir", [879,1163], BIT],
  ["assert_interrupt_control", 827, BIT_INV],
  /* transfers */
  ["pcl_abl", [438,1163,639], BIT],
  ["pch_abh", [1235,1163,821], BIT],
  ["dl_dor", [863,1163], BIT],
  ["dl_db_add", [863,859], BIT],
  ["dl_dbinv_add", [863,1068,859], BIT],
  ["dl_abh", [41,1163,821], BIT],
  ["add_pcl", [1015,414], BIT],
  ["add_sb_db", [129,1060], BIT],
  ["sb_db_dor", [1060,1163], BIT],
  ["sb_db_add", [1060,859], BIT],
  ["sb_dbinv_add", [1060,1068], BIT],
  ["pcl_adl_pcl", [438,414], BIT],
  ["pcl_abl", [438,639,1163], BIT],
  ["pch_adh_pch", [1235,48], BIT],
  ["add_sb_add", [129,549], BIT],
  ["n01_abh", [203,1163,821], BIT],
  ["s_abl", [1468,1163,639], BIT],
  ["pch_dor", [247,1163], BIT],
  ["pd_ir", [827, 879, 1163], BIT],
  ["bus_write", [-1156,421], BIT],
  ["bus_read", [1156,421], BIT],
  ["sum_add", [921,421], BIT],
  ["and_add", [574,421], BIT],
  ["eor_add", [1666,421], BIT],
  ["or_add", [59,421], BIT],
  ["sr_add", [362,421], BIT],
  /* registers */
  ["ir", [194,702,1182,1125,26,1394,895,1320], BYTE_INV],
  ["DB", [1005,82,945,650,1393,175,1591,1349], BYTE_],
  ["pd", [758,361,955,894,369,829,1669,1690], BYTE_INV],
  ["dor", [222,527,1288,823,873,1266,1418,158], BYTE_INV],
  ["pcl", [488,976,481,723,208,72,1458,1647], BYTE_],
  ["pcls", [1139,1022,655,1359,900,622,377,1611], BYTE_],
  ["pch", [1722,209,1496,141,27,1301,652,1206], BYTE_],
  ["pchs", [1670,292,502,584,948,49,1551,205], BYTE_],
  ["abh", [230,148,1443,399,1237,349,672,195], BYTE_],
  ["abl", [268,451,1340,211,435,736,887,1493], BYTE_],
  ["s", [418,1064,752,828,1603,601,1029,181], BYTE_INV],
  ["ai", [1167,1248,1332,1680,1142,530,1627,1522], BYTE_],
  ["bi", [977,1432,704,96,1645,1678,235,1535], BYTE_],
  ["add", [401,872,1637,1414,606,314,331,765], BYTE_],
  ["x", [1216,98,1,1648,85,589,448,777], BYTE_],
  ["y", [64,1148,573,305,989,615,115,843], BYTE_],
  ["ac", [737,1234,978,162,727,858,1136,1653], BYTE_]
];

var simulator;
const memory = new Uint8Array(2**16);

self.postMessage(["init", signal_list.map(function(x){return [x[0],x[2]];})])

self.onmessage = function(event) {
  let message = event.data[0];
  let param = event.data[1];
  if (message == "step") {
    self.postMessage([message, single_step()]);
  } else if (message == "run") {
    setInterval(function(){self.postMessage(["step", single_step()])}, 0);
  } else if (message == "init") {
    console.log("init from worker");
    /* load memory image */
    for (let i=0; i<65536; i++)
      memory[i] = param[i];
    /* autoplay through reset sequence */
    for (let i=0; i<16; i++)
      self.postMessage(["step", single_step()]);
  }
}

function single_step() {
  simulator.step();
  let addr = simulator.readAddressBus();
  /* handle memory */
  if (simulator.readNode(1156)) {
    /* read operation */
    simulator.writeDataBus(memory[addr]);
  } else if (simulator.readNode(421)) {
    memory[addr] = simulator.readDataBus();
    console.log(addr.toString(16) + " = " +
    simulator.readDataBus().toString(16));
  }
  return signal_list.map(function(signal){
    let [name, nodes, type] = signal;
    if (type==BIT || type==BIT_INV) {
      let value = true;
      if (nodes.constructor !== Array)
        nodes = [nodes];
      for (let i=0; i<nodes.length; i++)
        if (nodes[i] >= 0)
          value &= simulator.readNode(nodes[i]);
        else
          value &= !simulator.readNode(-nodes[i]);
      if (type == BIT_INV)
        value = !value;
      return value;
    } else if (type==BYTE_ || type==BYTE_INV) {
      let value = simulator.readNode8.apply(null, nodes);
      if (type == BYTE_INV)
        value ^= 255;
      return value;
    }
  });
}

(async function() {
  /* load wasm */
  const { instance } = await WebAssembly.instantiateStreaming(
    fetch("./6502.wasm")
  );
  simulator = instance.exports;
  simulator.initAndResetChip();
})();
