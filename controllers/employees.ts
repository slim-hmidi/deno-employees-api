import {
  HandlerFunc,
  Context,
} from "https://deno.land/x/abc@v1.0.0-rc2/mod.ts";
import db from "../config/db.ts";

const database = db.getDatabase;
const employees = database.collection("employees");

interface Employee {
  _id: {
    $oid: string;
  };
  name: string;
  age: number;
  salary: number;
}

export const createEmployee: HandlerFunc = async (c: Context) => {
  try {
    const body = await (c.body());
    if (!Object.keys(body).length) {
      return c.string("Request body can not be empty!", 400);
    }
    const { name, salary, age } = body;

    const insertedEmployee = await employees.insertOne({
      name,
      age,
      salary,
    });

    return c.json(insertedEmployee, 201);
  } catch (error) {
    return c.json(error, 500);
  }
};

export const fetchAllEmployees: HandlerFunc = async (c: Context) => {
  try {
    const fetchedEmployees: Employee[] = await employees.find();

    if (fetchedEmployees) {
      const list = fetchedEmployees.length
        ? fetchedEmployees.map((employee) => {
          const { _id: { $oid }, name, age, salary } = employee;
          return { id: $oid, name, age, salary };
        })
        : [];
      return c.json(list, 200);
    }
  } catch (error) {
    return c.json(error, 500);
  }
};

export const fetchOneEmployee: HandlerFunc = async (c: Context) => {
  try {
    const { id } = c.params as { id: string };

    const fetchedEmployee = await employees.findOne({ _id: { "$oid": id } });

    if (fetchedEmployee) {
      const { _id: { $oid }, name, age, salary } = fetchedEmployee;
      return c.json({ id: $oid, name, age, salary }, 200);
    }

    return c.string("Employee not found", 404);
  } catch (error) {
    return c.json(error, 500);
  }
};

export const updateEmployee: HandlerFunc = async (c: Context) => {
  try {
    const { id } = c.params as { id: string };

    const body = await (c.body()) as {
      name?: string;
      salary: string;
      age?: string;
    };

    if (!Object.keys(body).length) {
      return c.string("Request body can not be empty!", 400);
    }

    const fetchedEmployee = await employees.findOne({ _id: { "$oid": id } });

    if (fetchedEmployee) {
      const { matchedCount } = await employees.updateOne(
        { _id: { "$oid": id } },
        { $set: body },
      );
      if (matchedCount) {
        return c.string("Employee updated successfully!", 204);
      }
      return c.string("Unable to update employee");
    }

    return c.string("Employee not found", 404);
  } catch (error) {
    return c.json(error, 500);
  }
};

export const deleteEmployee: HandlerFunc = async (c: Context) => {
  try {
    const { id } = c.params as { id: string };

    const fetchedEmployee = await employees.findOne({ _id: { "$oid": id } });

    if (fetchedEmployee) {
      const deleteCount = await employees.deleteOne({ _id: { "$oid": id } });
      if (deleteCount) {
        return c.string("Employee deleted successfully!", 204);
      }
      return c.string("Unable to delete employee", 400);
    }

    return c.string("Employee not found", 404);
  } catch (error) {
    return c.json(error, 500);
  }
};
