"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostType = exports.UserRole = void 0;
// Enums
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["USER"] = "user";
})(UserRole || (exports.UserRole = UserRole = {}));
var PostType;
(function (PostType) {
    PostType["BLOG"] = "blog";
    PostType["NEWS"] = "news";
    PostType["TUTORIAL"] = "tutorial";
})(PostType || (exports.PostType = PostType = {}));
