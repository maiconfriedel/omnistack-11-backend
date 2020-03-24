const crypto = require("crypto");
const connection = require("../database/connection");

module.exports = {
  async create(req, res) {
    try {
      const { name, email, whatsapp, city, uf } = req.body;

      const id = crypto.randomBytes(4).toString("HEX");

      await connection("ongs").insert({
        id,
        name,
        email,
        whatsapp,
        city,
        uf
      });

      return res.json({ id });
    } catch (error) {
      return res.status(500).json({ error });
    }
  },

  async index(req, res) {
    const ongs = await connection.table("ongs").select("*");

    return res.json(ongs);
  }
};
