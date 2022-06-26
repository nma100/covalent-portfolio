class Chain {
    constructor(id, name, decimal, scanBase, 
        scanAddrUri, scanTxUri) {
      this.id = id;
      this.name = name;
      this.decimal = decimal;
      this.scanBase = scanBase;
      this.scanAddrUri = scanAddrUri;
      this.scanTxUri = scanTxUri
    }
}

export default Chain;
