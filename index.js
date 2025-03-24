const express = require("express");
const fs = require("fs");

const users = require("./MOCK_DATA.json");
const { error } = require("console");
const { stringify } = require("querystring");

const app = express();
const PORT = 8000;

// midleware 
app.use(express.urlencoded({ extended: false}));

app.get("/users", (req,res) => {

    const html = `
    <ul>
    ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
    </ul>
    `;

    res.send(html)

})


//Routes


app.get("/api/users", (req,res) => {
    return res.json(users);
})



app
.route("/api/users/:id")
.get((req,res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    return res.json(user)
})
.patch((req, res) => {
    //  TOODO: edit the user with id
    const id = Number(req.params.id);

    // Find index of user
    const userIndex = users.findIndex((user) => user.id === id);
    
    if (userIndex === -1) {
        return res.status(404).json({ error: "User not found." });
    }

    // Get the existing user data
    const existingUser = users[userIndex];

    // Merge the existing user data with the updated fields from req.body
    const updatedUser = { ...existingUser, ...req.body };

    // Save the updated user back into the array
    users[userIndex] = updatedUser;

    // Save changes to MOCK_DATA.json
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ error: "Failed to update user" });
        }
        return res.json({ message: "User updated successfully", user: updatedUser });
    });
    
})
.delete((req, res) => {
    const id = Number(req.params.id);

    // Find the index of the user to be deleted
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
        return res.status(404).json({ error: "User not found." });
    }

    // Remove the user from the array
    users.splice(userIndex, 1);

    // Save changes to MOCK_DATA.json
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ error: "Failed to delete user" });
        }
        return res.json({ message: "User deleted successfully" });
    });
})
app.post("/api/users", (req, res) => {
    //  TOODO: Create new user 
    const body = req.body;
    users.push({...body , id: users.length + 1});
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
        // console.log("body",body)
        return res.json({status: "pending", id: users.length });
    })
   
})


app.listen(PORT, () => console.log(`Server started at PORT ${PORT}`))