const connection = require("../config/mysql");

module.exports = {
  getAllHistory: () => {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM history`, (err, data) => {
        !err ? resolve(data) : reject(new Error(err));
      });
    });
  },
  getHistoryId: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM history WHERE history_id = ${id}`,
        (err, data) => {
          !err ? resolve(data) : reject(new Error(err));
        }
      );
    });
  },
  postHistory: (setData) => {
    return new Promise((resolve, reject) => {
      connection.query(`INSERT INTO history SET ?`, setData, (err, data) => {
        if (!err) {
          const newResult = {
            history_id: data.insertId,
            ...setData,
          };
          resolve(newResult);
        } else {
          reject(new Error(err));
        }
      });
    });
  },
  patchHistory: (setData, id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE history SET ? WHERE history_id = ?`,
        [setData, id],
        (err, data) => {
          if (!err) {
            const newResult = {
              history_id: id,
              ...setData,
            };
            resolve(newResult);
          } else {
            reject(new Error(err));
          }
        }
      );
    });
  },
  // ------------------------------------
  getTodayTotal: () => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT sum(history_subtotal) as total FROM history WHERE DAY(created_at) = DAY(NOW())",
        (err, data) => {
          !err ? resolve(data[0].total) : reject(new Error(err));
        }
      );
    });
  },
  // ---------------------------------------
  getDataOrder: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM orders JOIN menu_items ON orders.menu_id = menu_items.menu_id WHERE history_id = ?`,
        id,
        (err, data) => {
          !err ? resolve(data) : reject(new Error(err));
        }
      );
    });
  },
};
