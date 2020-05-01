// @ts-ignore
import { Application } from "https://deno.land/x/abc/mod.ts";

import {
  fetchAllEmployees,
  createEmployee,
  fetchOneEmployee,
  updateEmployee,
  deleteEmployee
}
  from "./controllers/employees.ts";




const app = new Application();

app.get("/employees", fetchAllEmployees)
  .post("/employees", createEmployee)
  .get("/employees/:id", fetchOneEmployee)
  .put("/employees/:id", updateEmployee)
  .delete("/employees/:id", deleteEmployee)
  .start({ port: 5000 });

console.log(`server listening on http://localhost:5000`);