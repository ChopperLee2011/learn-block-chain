import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect({
  network: "hardhatMainnet",
  chainType: "l1",
});

describe("Todo", () => {
  let todo: any;
  beforeEach(async () => {
    todo = await ethers.deployContract("Todo");
  });

  it("should able to create a task", async () => {
    expect(await todo.createTask("working on the todo.createTask")).to.emit(
      todo,
      "TaskLog"
    );
    const task = await todo.todos(0);
    expect(task[0]).to.equal(0);
    expect(task[1]).to.eql("working on the todo.createTask");
    expect(typeof task[2]).to.equal("bigint");
    expect(task[3]).to.be.a("string");
  });
  it("should return all todos", async () => {
    await todo.createTask("working on the todo.getTodos");
    const tasks = await todo.getTodos();
    expect(tasks.length).to.equal(1);
  });
  it("should able to update task status", async () => {
    await todo.createTask("working on the todo.updateTaskStatus");
    await todo.updateTaskStatus(0, 1);
    const task = await todo.todos(0);
    expect(task[0]).to.equal(1);
  });
  it("should able to remove task", async () => {
    await todo.createTask("working on the todo.removeTask");
    await todo.removeTask(0);
    await expect(todo.todos(0)).to.be.revert;
  });
});
