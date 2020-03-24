const connection = require("../database/connection");

module.exports = {
  async create(req, res) {
    try {
      const { title, description, value } = req.body;

      const ong_id = req.headers.authorization;

      const [id] = await connection("incidents").insert({
        title,
        description,
        value,
        ong_id
      });

      return res.json({ id });
    } catch (error) {
      return res.status(500).json({ error });
    }
  },

  async index(req, res) {
    const { page = 1 } = req.query;

    const [count] = await connection.table("incidents").count();

    const incidents = await connection
      .table("incidents")
      .join("ongs", "ongs.id", "=", "incidents.ong_id")
      .limit(5)
      .offset((page - 1) * 5)
      .select([
        "incidents.*",
        "ongs.name",
        "ongs.email",
        "ongs.whatsapp",
        "ongs.city",
        "ongs.uf"
      ]);

    res.header("X-Total-Count", count["count(*)"]);

    return res.json(incidents);
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const ong_id = req.headers.authorization;

      const incident = await connection
        .table("incidents")
        .where("id", id)
        .select("ong_id")
        .first();

      if (incident.ong_id !== ong_id) {
        return res.status(401).json({ error: "Operation not allowed." });
      }

      await connection
        .table("incidents")
        .where("id", id)
        .delete();

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
};
