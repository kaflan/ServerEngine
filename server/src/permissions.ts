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
    {resource: "users", actions: ["list", "self-update"]},
    {resource: "posts", actions: ["list", "self-update", "self-delete", "create"]}
  ]);
  await globalVars.permissions.createGroup("admin", [
    {resource: "users", actions: ["*"]},
    {resource: "posts", actions: ["*"]}
  ]);

  //await globalVars.permissions.addToGroup("admin", 1);
}

