export class DetaDB {
  baseURL: string
  dbKey: string

  constructor(projectid: string, accesskey: string) {
    this.baseURL = `https://database.deta.sh/v1/${projectid}`;
    this.dbKey = accesskey;
  }

  async query(db: string, query: Array<object>): Promise<Array<object>> {
    var Querydata = {
      query: query,
    };

    var resp;

    resp = await fetch(this.baseURL + `/${db}/query`, {
      method: "POST",
      headers: {
        "X-API-Key": this.dbKey,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Querydata),
    });

    if (!resp.ok) {
      throw new Error("dberror");
    }
    var jsn = await resp.json();
    return jsn["items"];
  }

  async put(db: string, items: Array<object>): Promise<boolean> {
    var data = {
      items: items,
    };

    var resp;

    resp = await fetch(this.baseURL + `/${db}/items`, {
      method: "PUT",
      headers: {
        "X-API-Key": this.dbKey,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!resp.ok) {
      throw new Error("dberror");
    }

    var jsn = await resp.json();
    if (jsn["processed"]["items"].length == items.length) {
      return true;
    }
    return false;
  }
  async update(db: string, key: string, data: object): Promise<boolean> {
    var resp;

    resp = await fetch(this.baseURL + `/${db}/items/${key}`, {
      method: "PATCH",
      headers: {
        "X-API-Key": this.dbKey,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!resp.ok) {
      return false;
    }
    return true;
  }
}