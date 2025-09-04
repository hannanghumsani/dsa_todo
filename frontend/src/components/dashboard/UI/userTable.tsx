"use client";
import { useState } from "react";
import { Table, Spinner, Accordion, Form, Row, Col } from "react-bootstrap";
import { FaCheckCircle, FaRegCircle, FaExternalLinkAlt } from "react-icons/fa";
import Link from "next/link";

interface TableComponentProps {
  meta: any;
  topics: any[];
  loading: boolean;
  topicToggle: (id: string) => void;
  handleLogout: () => void;
}

export default function TableComponent({
  meta,
  topics,
  loading,
  topicToggle,
  handleLogout,
}: TableComponentProps) {
  const [activeKey, setActiveKey] = useState("0");

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "200px" }}
      >
        <Spinner animation="border" role="status" className="text-primary" />
      </div>
    );
  }

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "easy":
        return "text-success"; // Green
      case "medium":
        return "text-warning"; // Yellow
      case "hard":
        return "text-danger"; // Red
      default:
        return "text-secondary"; // Gray
    }
  };

  const getStatusTextAndColor = (status: boolean) => {
    return status
      ? { text: "Done", color: "text-success" }
      : { text: "Pending", color: "text-warning" };
  };

  return (
    <div className="d-flex">
      {/* Left Sidebar Navigation */}
      <nav className="bg-gray-900 text-gray-200 shadow-lg h-screen w-64 fixed top-0 left-0 flex flex-col p-6">
        <div className="mb-8">
          <a href="/" className="text-2xl font-bold text-white tracking-wide">
            DSA To DO
          </a>
        </div>
        <div className="flex flex-col space-y-4">
          <Link
            href="/dashboard"
            className="text-gray-300 hover:text-white hover:bg-gray-800 px-4 py-2 rounded-md transition-all duration-300 ease-in-out flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Home
          </Link>
          <button
            className="text-gray-300 hover:text-white hover:bg-gray-800 px-4 py-2 rounded-md transition-all duration-300 ease-in-out flex items-center"
            onClick={handleLogout}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h3a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-6">
        <div className="container my-5">
          {/* Overall Stats Section */}
          {meta && (
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-light">
              <h4 className="text-primary mb-3 fw-bold">Overall Progress 🚀</h4>
              <Row className="g-3">
                <Col xs={12} sm={4}>
                  <div className="d-flex flex-column align-items-center p-3 bg-light rounded-lg">
                    <h5 className="text-muted mb-1">Total</h5>
                    <p className="fs-4 fw-bold text-dark">{meta.total}</p>
                  </div>
                </Col>
                <Col xs={12} sm={4}>
                  <div className="d-flex flex-column align-items-center p-3 bg-light rounded-lg">
                    <h5 className="text-muted mb-1">Done</h5>
                    <p className="fs-4 fw-bold text-success">{meta.done}</p>
                  </div>
                </Col>
                <Col xs={12} sm={4}>
                  <div className="d-flex flex-column align-items-center p-3 bg-light rounded-lg">
                    <h5 className="text-muted mb-1">Pending</h5>
                    <p className="fs-4 fw-bold text-warning">{meta.pending}</p>
                  </div>
                </Col>
              </Row>
            </div>
          )}

          {/* Topics Accordion Section */}
          <Accordion
            activeKey={activeKey}
            onSelect={(eventKey) => setActiveKey((eventKey as string) || "0")}
          >
            {topics?.map((topicGroup, index) => (
              <Accordion.Item
                eventKey={index.toString()}
                key={index}
                className="mb-3 border-0 rounded-lg shadow-sm"
              >
                <Accordion.Header className="rounded-top-lg">
                  <div className="d-flex w-100 align-items-center justify-content-between pe-3">
                    <h5 className="mb-0 text-primary">{topicGroup.topic}</h5>
                    <div className="d-flex align-items-center">
                      <span className="me-3 text-muted">
                        Total:{" "}
                        <span className="fw-bold">
                          {topicGroup.stats.total}
                        </span>
                      </span>
                      <span className="me-3 text-success">
                        Done:{" "}
                        <span className="fw-bold">{topicGroup.stats.done}</span>
                      </span>
                      <span className="text-warning">
                        Pending:{" "}
                        <span className="fw-bold">
                          {topicGroup.stats.pending}
                        </span>
                      </span>
                    </div>
                  </div>
                </Accordion.Header>
                <Accordion.Body className="bg-light p-0">
                  <Table responsive striped bordered hover className="mb-0">
                    <thead>
                      <tr className="bg-secondary text-white">
                        <th>Status</th>
                        <th>Task Name</th>
                        <th>Level</th>
                        <th>Links</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topicGroup.data.map((task: any) => {
                        const statusInfo = getStatusTextAndColor(task.status);
                        return (
                          <tr key={task._id} className="align-middle">
                            <td>
                              <Form.Check
                                type="checkbox"
                                checked={task.status}
                                onChange={() => topicToggle(task._id)}
                                id={`checkbox-${task._id}`}
                                className="d-flex justify-content-center"
                                label={
                                  <span className={statusInfo.color + " ms-2"}>
                                    {statusInfo.text}
                                  </span>
                                }
                              />
                            </td>
                            <td>{task.task_name}</td>
                            <td>
                              <span
                                className={`fw-bold ${getLevelColor(
                                  task.level
                                )}`}
                              >
                                {task.level.charAt(0).toUpperCase() +
                                  task.level.slice(1)}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex flex-column gap-2">
                                {task.leetcode_link && (
                                  <a
                                    href={task.leetcode_link}
                                    target="_blank"
                                    className="text-decoration-none"
                                  >
                                    <span className="d-flex align-items-center text-primary">
                                      LeetCode{" "}
                                      <FaExternalLinkAlt
                                        className="ms-1"
                                        size={10}
                                      />
                                    </span>
                                  </a>
                                )}
                                {task.yt_link && (
                                  <a
                                    href={task.yt_link}
                                    target="_blank"
                                    className="text-decoration-none"
                                  >
                                    <span className="d-flex align-items-center text-danger">
                                      YouTube{" "}
                                      <FaExternalLinkAlt
                                        className="ms-1"
                                        size={10}
                                      />
                                    </span>
                                  </a>
                                )}
                                {task.article_link && (
                                  <a
                                    href={task.article_link}
                                    target="_blank"
                                    className="text-decoration-none"
                                  >
                                    <span className="d-flex align-items-center text-info">
                                      Article{" "}
                                      <FaExternalLinkAlt
                                        className="ms-1"
                                        size={10}
                                      />
                                    </span>
                                  </a>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
