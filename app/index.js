"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _data = _interopRequireDefault(require("../data.json"));

var _moment = _interopRequireDefault(require("moment"));

var _mongodb = _interopRequireDefault(require("mongodb"));

var _path = _interopRequireDefault(require("path"));

console.log(process.env.MONGO_URL);
var mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017/hrtest';
var app = (0, _express["default"])(); // Create a middleware

var middleware = function middleware(req, res, next) {
  // here we can check token on the headers for authentication
  // and block access to the routes that need authorisation.
  // Not implemented for now :)
  console.log("middle");
  next();
}; // init MongoDB


var initMongo = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var client;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log('Starting MongoDB...');
            _context.prev = 1;
            _context.next = 4;
            return _mongodb["default"].connect(mongoURL, {
              useNewUrlParser: true,
              useUnifiedTopology: true
            });

          case 4:
            client = _context.sent;
            _context.next = 10;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](1);
            console.log(_context.t0);

          case 10:
            console.log('MongoDB started...');
            return _context.abrupt("return", client.db(client.s.options.dbName).collection('users'));

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 7]]);
  }));

  return function initMongo() {
    return _ref.apply(this, arguments);
  };
}();

var init = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
    var db;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return initMongo();

          case 2:
            db = _context7.sent;
            _context7.next = 5;
            return storeUsers(db);

          case 5:
            app.set("port", 5000);
            app.set('views', './views');
            app.set('view engine', 'pug');
            app.use(_express["default"]["static"](_path["default"].join(__dirname, 'public')));
            app.use(_express["default"].json());
            app.use(_express["default"].urlencoded({
              extended: true
            }));
            app.get("/", function (req, res) {
              res.render('index', {
                title: 'Test'
              });
            });
            app.get("/list", /*#__PURE__*/function () {
              var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
                var nearlyExpiredNames, currDate, users;
                return _regenerator["default"].wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        nearlyExpiredNames = [];
                        currDate = (0, _moment["default"])();
                        _context2.next = 4;
                        return getUsers(db);

                      case 4:
                        users = _context2.sent;
                        users.forEach(function (user) {
                          // We add a year on the last updated date and we compare
                          // it with the current date for showing the nearly expired
                          // names
                          var lastUpdateDate = (0, _moment["default"])(user.nameUpdated).add(1, 'y');

                          var diff = _moment["default"].duration(lastUpdateDate.diff(currDate));

                          if (diff.asDays() <= 28) nearlyExpiredNames.push(user.name);
                        });
                        res.render("list", {
                          siteTitle: "Test",
                          title: "Names close to expiry!",
                          names: nearlyExpiredNames
                        });

                      case 7:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));

              return function (_x, _x2) {
                return _ref3.apply(this, arguments);
              };
            }());
            app.post("/", /*#__PURE__*/function () {
              var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
                var user;
                return _regenerator["default"].wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.next = 2;
                        return getUserByUsername(db, req.body.username);

                      case 2:
                        user = _context3.sent;

                        if (user) {
                          res.redirect("/users/".concat(user.username));
                        } else {
                          res.redirect("/");
                        }

                      case 4:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3);
              }));

              return function (_x3, _x4) {
                return _ref4.apply(this, arguments);
              };
            }());
            app.get("/users/:username", middleware, /*#__PURE__*/function () {
              var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
                var user;
                return _regenerator["default"].wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        _context4.next = 2;
                        return getUserByUsername(db, req.params.username);

                      case 2:
                        user = _context4.sent;

                        if (user) {
                          res.render("user", {
                            siteTitle: "Test",
                            user: user,
                            message: ""
                          });
                        } else {
                          res.redirect("/");
                        }

                      case 4:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4);
              }));

              return function (_x5, _x6) {
                return _ref5.apply(this, arguments);
              };
            }());
            app.post("/users/:username", middleware, /*#__PURE__*/function () {
              var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
                var user, newName, previousNameSet, newUser;
                return _regenerator["default"].wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        _context5.next = 2;
                        return getUserByUsername(db, req.params.username);

                      case 2:
                        user = _context5.sent;
                        newName = req.body.newName;
                        previousNameSet = new Set(user.previousNames);

                        if (!previousNameSet.has(newName)) {
                          _context5.next = 9;
                          break;
                        }

                        res.render("user", {
                          siteTitle: "Test",
                          user: user,
                          message: "The inserted name was previously used!"
                        });
                        _context5.next = 15;
                        break;

                      case 9:
                        _context5.next = 11;
                        return updateUserData(db, user.username, [].concat((0, _toConsumableArray2["default"])(user.previousNames), [user.name]), newName, (0, _moment["default"])().format());

                      case 11:
                        _context5.next = 13;
                        return getUserByUsername(db, user.username);

                      case 13:
                        newUser = _context5.sent;
                        res.render("user", {
                          siteTitle: "Test",
                          user: newUser,
                          message: "Name has been updated correctly!"
                        });

                      case 15:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee5);
              }));

              return function (_x7, _x8) {
                return _ref6.apply(this, arguments);
              };
            }());
            app.get("/users/:username/list", middleware, /*#__PURE__*/function () {
              var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res) {
                var user;
                return _regenerator["default"].wrap(function _callee6$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        _context6.next = 2;
                        return getUserByUsername(db, req.params.username);

                      case 2:
                        user = _context6.sent;
                        res.render("list", {
                          siteTitle: "Test",
                          title: "Previously used names!",
                          names: user.previousNames
                        });

                      case 4:
                      case "end":
                        return _context6.stop();
                    }
                  }
                }, _callee6);
              }));

              return function (_x9, _x10) {
                return _ref7.apply(this, arguments);
              };
            }());
            app.listen(app.get("port"), function () {
              console.log("App started listening on PORT: ".concat(app.get("port")));
            });

          case 18:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function init() {
    return _ref2.apply(this, arguments);
  };
}();

function storeUsers(_x11) {
  return _storeUsers.apply(this, arguments);
}

function _storeUsers() {
  _storeUsers = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(db) {
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return db.insertMany(_data["default"]);

          case 2:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));
  return _storeUsers.apply(this, arguments);
}

function getUsers(_x12) {
  return _getUsers.apply(this, arguments);
}

function _getUsers() {
  _getUsers = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(db) {
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return db.find({}).toArray();

          case 2:
            return _context9.abrupt("return", _context9.sent);

          case 3:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));
  return _getUsers.apply(this, arguments);
}

function getUserByUsername(_x13, _x14) {
  return _getUserByUsername.apply(this, arguments);
}

function _getUserByUsername() {
  _getUserByUsername = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(db, username) {
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
            return db.findOne({
              username: username
            });

          case 2:
            return _context10.abrupt("return", _context10.sent);

          case 3:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));
  return _getUserByUsername.apply(this, arguments);
}

function updateUserData(_x15, _x16, _x17, _x18, _x19) {
  return _updateUserData.apply(this, arguments);
}

function _updateUserData() {
  _updateUserData = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(db, username, prevNames, newName, updateDate) {
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.next = 2;
            return db.updateOne({
              username: username
            }, {
              $set: {
                name: newName,
                previousNames: prevNames,
                nameUpdated: updateDate
              }
            });

          case 2:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  }));
  return _updateUserData.apply(this, arguments);
}

init();
//# sourceMappingURL=index.js.map