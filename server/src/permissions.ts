import globalVars from "./core/GlobalVars";

export async function applyAcl() {
  await globalVars.permissions.createResource("users", [
    "list",
    "update",
    "self-update",
    "delete",
    "create"
  ]);
  await globalVars.permissions.createResource("posts", [
    "list",
    "update",
    "self-update",
    "delete",
    "self-delete",
    "create"
  ]);
  await globalVars.permissions.createGroup("user", [
    {resource: "users", permissions: ["list", "self-update"]},
    {resource: "posts", permissions: ["list", "self-update", "self-delete", "create"]}
  ]);
  await globalVars.permissions.createGroup("admin", [
    {resource: "users", permissions: ["*"]},
    {resource: "posts", permissions: ["*"]}
  ]);
}

