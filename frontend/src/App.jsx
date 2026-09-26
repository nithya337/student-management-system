import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchStudents = () => {
    axios
      .get("http://localhost:5000/students")
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
      });
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const addStudent = (event) => {
    event.preventDefault();

    axios
      .post("http://localhost:5000/students", {
        name: name,
        email: email,
        age: age,
      })
      .then((response) => {
        alert(response.data.message);

        setName("");
        setEmail("");
        setAge("");

        fetchStudents();
      })
      .catch((error) => {
        console.error("Error adding student:", error);
      });
  };

  const deleteStudent = (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      axios
        .delete(`http://localhost:5000/students/${id}`)
        .then((response) => {
          alert(response.data.message);
          fetchStudents();
        })
        .catch((error) => {
          console.error("Error deleting student:", error);
        });
    }
  };

  const editStudent = (student) => {
    setEditingId(student.id);
    setName(student.name);
    setEmail(student.email);
    setAge(student.age);
    setIsEditing(true);
  };

  const updateStudent = (event) => {
    event.preventDefault();

    axios
      .put(`http://localhost:5000/students/${editingId}`, {
        name: name,
        email: email,
        age: age,
      })
      .then((response) => {
        alert(response.data.message);

        setName("");
        setEmail("");
        setAge("");
        setEditingId(null);
        setIsEditing(false);

        fetchStudents();
      })
      .catch((error) => {
        console.error("Error updating student:", error);
      });
  };

  const cancelEdit = () => {
    setName("");
    setEmail("");
    setAge("");
    setEditingId(null);
    setIsEditing(false);
  };

  return (
    <div className="container">

      <h1>Student Management System</h1>

      <div className="form-section">

        <h2>
          {isEditing ? "Edit Student" : "Add Student"}
        </h2>

        <form
          className="student-form"
          onSubmit={isEditing ? updateStudent : addStudent}
        >

          <input
  type="text"
  placeholder="Enter name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  required
  minLength="2"
/>
<input
  type="email"
  placeholder="Enter email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
/>

    <input
  type="number"
  placeholder="Enter age"
  value={age}
  onChange={(e) => setAge(e.target.value)}
  required
  min="1"
  max="100"
/>

          <button type="submit">
            {isEditing ? "Update Student" : "Add Student"}
          </button>

          {isEditing && (
            <button
              type="button"
              className="cancel-btn"
              onClick={cancelEdit}
            >
              Cancel
            </button>
          )}

        </form>

      </div>

      <div className="students-section">

        <h2>Students</h2>

        {students.map((student) => (

          <div className="student-card" key={student.id}>

            <div className="student-info">

              <p>
                <strong>Name:</strong> {student.name}
              </p>

              <p>
                <strong>Email:</strong> {student.email}
              </p>

              <p>
                <strong>Age:</strong> {student.age}
              </p>

            </div>

            <div className="student-actions">

              <button
                className="edit-btn"
                onClick={() => editStudent(student)}
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => deleteStudent(student.id)}
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default App;