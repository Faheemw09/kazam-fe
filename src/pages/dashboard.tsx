import React, { useEffect, useState } from "react";
import {
  Drawer,
  Button,
  Modal,
  Input,
  Select,
  DatePicker,
  message,
} from "antd";
import { useAuth } from "../context/AuthContext";
import { useTaskContext } from "../context/TaskContext";
import DataTable from "react-data-table-component";

const Dashboard: React.FC = () => {
  const { tasks, createTask, updateTask, deleteTask, fetchTasks } =
    useTaskContext();
  const { logout, user, token } = useAuth();
  // console.log(token, tasks);
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const [visible, setVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [logoutConfirmVisible, setLogoutConfirmVisible] = useState(false);

  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [title, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"pending" | "completed">(
    "pending"
  );
  const [dueDate, setDueDate] = useState<any>(null);

  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesStatus = filterStatus ? task.status === filterStatus : true; // Shows all if filterStatus is empty
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      name: "Sr.No",
      selector: (row: any, index) => String(index + 1).padStart(2, "0"),
      sortable: true,
    },
    {
      name: "Task Name",
      selector: (row: any) => row.title,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
    },
    {
      name: "Due Date",
      selector: (row) => new Date(row.dueDate).toLocaleString(),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (
        <div
          style={{ color: row.status === "completed" ? "#28a745" : "#ff9800" }}
        >
          {row.status}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center space-x-2">
          <Button
            type="link"
            className="text-blue-500 no-hover"
            onClick={() => openEditModal(row)}
          >
            Edit
          </Button>
          <span className="text-gray-400">|</span>
          <Button
            type="link"
            className="text-red-500 no-hover"
            onClick={() => handleDelete(row._id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const handleSubmit = () => {
    if (!title || !description || !dueDate) {
      Modal.error({
        title: "All details are required",
        content: "Please enter all details.",
        okButtonProps: {
          style: { backgroundColor: "green", borderColor: "green" },
        },
      });
      return;
    }

    const taskData = { title, description, status: selectedStatus, dueDate };
    createTask(taskData);
    message.success("Task created successfully!");
    setVisible(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this task?",
      content: "This action cannot be undone.",
      okText: "Yes",
      cancelText: "No",
      okButtonProps: {
        style: { backgroundColor: "green", borderColor: "green" },
      },
      onOk: async () => {
        await deleteTask(id);
        message.success("Task deleted successfully!");
      },
    });
  };
  const openEditModal = (task: any) => {
    setSelectedTask(task);
    setEditModalVisible(true);
  };

  const handleStatusChange = (value: any) => {
    setSelectedTask((prev) => ({ ...prev, status: value }));
  };
  const handleStatusUpdate = async () => {
    if (!selectedTask) return;

    await updateTask(selectedTask._id, selectedTask.status);
    message.success("Task Updated Sucessfully");
    setEditModalVisible(false);
  };

  const handleLogout = () => {
    setLogoutConfirmVisible(true);
  };

  const confirmLogout = () => {
    logout();
    window.location.href = "/";
  };

  const resetForm = () => {
    setTaskName("");
    setDescription("");
    setDueDate(null);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <nav className="flex justify-between items-center bg-[#004de1] text-white p-4 rounded">
        <span className="text-lg font-semibold">
          Hey {user?.name} welcome Back!
        </span>
        <Button type="primary" danger onClick={handleLogout}>
          Logout
        </Button>
      </nav>

      <div className="flex flex-wrap gap-2 my-4">
        <Input.Search
          placeholder="Search Tasks"
          className="flex-grow w-40"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Select
          value={filterStatus}
          onChange={(value) => setFilterStatus(value)}
          className="w-40"
          allowClear
        >
          <Select.Option value="pending">Pending</Select.Option>
          <Select.Option value="completed">Completed</Select.Option>
          <Select.Option value="">All</Select.Option>{" "}
        </Select>
        <Button
          type="primary"
          className="bg-[#df8600]"
          onClick={() => setVisible(true)}
        >
          Add Task
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={filteredTasks}
        pagination
        highlightOnHover
        responsive
      />

      <Drawer
        title="Add Task"
        placement="right"
        onClose={() => setVisible(false)}
        open={visible}
        width={400}
      >
        <Input
          placeholder="Task Name"
          value={title}
          onChange={(e) => setTaskName(e.target.value)}
          required
        />
        <Input.TextArea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-2"
        />
        <Select
          value={selectedStatus}
          onChange={(value) => setSelectedStatus(value)}
          className="w-full mt-2"
        >
          <Select.Option value="pending">Pending</Select.Option>
          <Select.Option value="completed">Completed</Select.Option>
        </Select>
        <DatePicker
          value={dueDate}
          onChange={(date) => setDueDate(date)}
          className="w-full mt-2"
        />
        <Button
          type="primary"
          onClick={handleSubmit}
          className="mt-4 w-full bg-[#df8600]"
        >
          Create Task
        </Button>
      </Drawer>

      <Modal
        title="Edit Task Status"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleStatusUpdate}
        okButtonProps={{
          style: { backgroundColor: "green", borderColor: "green" },
        }}
      >
        <p>
          Update status for: <strong>{selectedTask?.title}</strong>
        </p>
        <Select
          value={selectedTask?.status}
          onChange={handleStatusChange}
          className="w-full mt-2"
        >
          <Select.Option value="pending">Pending</Select.Option>
          <Select.Option value="completed">Completed</Select.Option>
        </Select>
      </Modal>

      <Modal
        title="Confirm Logout"
        open={logoutConfirmVisible}
        onCancel={() => setLogoutConfirmVisible(false)}
        onOk={confirmLogout}
        okButtonProps={{
          style: { backgroundColor: "green", borderColor: "green" },
        }}
      >
        <p>Are you sure you want to log out?</p>
      </Modal>
    </div>
  );
};

export default Dashboard;
