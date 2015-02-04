module.exports = {
  secret : "ABE Starter secret key",

  debug: true,

  admin: {
    password: 'admin',
    email: 'admin@admin.com'
  },

  // MongoDB configuration
  mongo : {
    host : "localhost",
    port : "27017",
    db : "abeStarter"
  },

  // Regex
  regex : {
    phone: /^([0-9]{9})$/,
    email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  },

  // Restrictions enum
  restrictions : {
    read: 0,
    write: 1,
    update: 2,
    delete: 3,
    admin: 4
  }
}