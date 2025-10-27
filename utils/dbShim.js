// LocalStorage-backed shim to replace trickle.* functions so the app runs locally
// Provides: trickleCreateObject(collection, data), trickleListObjects(collection, limit, includeData), trickleGetObject(collection, id)
(function(){
  function _readDB(){
    try{ return JSON.parse(localStorage.getItem('mock_db') || '{}'); }catch(e){ return {}; }
  }
  function _writeDB(db){ localStorage.setItem('mock_db', JSON.stringify(db)); }

  async function trickleCreateObject(collection, data){
    const db = _readDB();
    db[collection] = db[collection] || [];
    const id = Date.now().toString() + Math.random().toString(36).slice(2,8);
    const item = { objectId: id, objectData: data };
    db[collection].push(item);
    _writeDB(db);
    return item;
  }

  async function trickleGetObject(collection, objectId){
    const db = _readDB();
    const list = db[collection] || [];
    return list.find(i => i.objectId === objectId) || null;
  }

  async function trickleListObjects(collection, limit = 100, includeData = false){
    const db = _readDB();
    const list = db[collection] || [];
    const items = list.slice(0, limit);
    // Keep structure similar to original usage: { items: [...] }
    return { items };
  }

  // Expose globally
  window.trickleCreateObject = trickleCreateObject;
  window.trickleGetObject = trickleGetObject;
  window.trickleListObjects = trickleListObjects;
})();
