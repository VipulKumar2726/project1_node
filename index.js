const express = require("express");
const fs = require("fs");
const mongoose = require("mongoose");
const users = require("./MOCK_DATA.json");
const { error } = require("console");
const { stringify } = require("querystring");

const app = express();
const PORT = 8000;

// connection
mongoose.connect('mongodb+srv://kewatvipulkumar:Vipul123@cluster0.l9pfn.mongodb.net/Test ')
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("Mongo Error", err))

// Schema

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true,
    },
    lastName: {
        type: String,

    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    jobTitle: {
        type: String,

    },
    gender: {
        type: String,
    }
}, { timestamps: true })

const User = mongoose.model('User', userSchema)




// midleware - plugin
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    // console.log("Hello from middleware1")
    // return res.json({message: "Hello from middleware1"})

    fs.appendFile("log.txt", `\n${Date.now()}: ${req.ip} ${req.method}: ${req.path}\n`, (err, data) => {
        next();
    })

})
// app.use((req, res, next) => {
//     console.log("Hello from middleware2")
//     // return res.end("Hey");
//     next();
// })




app.get("/users", async (req, res) => {
    const allDbUsers = await User.find({});
    const html = `
    <ul>
    ${allDbUsers.map((user) => `<li>${user.firstName} - ${user.email}</li>`).join("")}
    </ul>
    `;

    res.send(html)

})


//Routes


app.get("/api/users", async (req, res) => {
    const allDbUsers = await User.find({});
    // res.setHeader('X-MyName', 'vipul kumar')  // custom header
    //  Always add X to custom header
    // console.log(req.headers)
    return res.json(allDbUsers);
})



app
    .route("/api/users/:id")
    .get(async (req, res) => { 
        const user = await User.findById(req.params.id);
        // console.log("dfdfdfdfdfdf", user);
        if (!user) return res.status(404).json({ error: "user not found" })
        return res.json(user);
       
    })
    .patch( async (req, res) => {
await User.findByIdAndUpdate(req.params.id , { lastName: "mudha"});
  return res.json({status: "Success"});

        //  TOODO: edit the user with id
        // const id = Number(req.params.id);

        // Find index of user
        // const userIndex = users.findIndex((user) => user.id === id);

        // if (userIndex === -1) {
        //     return res.status(404).json({ error: "User not found." });
        // }

        // // Get the existing user data
        // const existingUser = users[userIndex];

        // // Merge the existing user data with the updated fields from req.body
        // const updatedUser = { ...existingUser, ...req.body };

        // // Save the updated user back into the array
        // users[userIndex] = updatedUser;

        // // Save changes to MOCK_DATA.json
        // fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
        //     if (err) {
        //         return res.status(500).json({ error: "Failed to update user" });
        //     }
        //     return res.json({ message: "User updated successfully", user: updatedUser });
        // });

    })
    .delete( async (req, res) => {

        await User.findByIdAndDelete(req.params.id);
        return res.json({status: "success"})


        // const id = Number(req.params.id);

        // // Find the index of the user to be deleted
        // const userIndex = users.findIndex((user) => user.id === id);

        // if (userIndex === -1) {
        //     return res.status(404).json({ error: "User not found." });
        // }

        // // Remove the user from the array
        // users.splice(userIndex, 1);

        // // Save changes to MOCK_DATA.json
        // fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
        //     if (err) {
        //         return res.status(500).json({ error: "Failed to delete user" });
        //     }
        //     return res.json({ message: "User deleted successfully" });
        // });
    })
app.post("/api/users", async (req, res) => {
    const body = req.body;
    if (!body ||
        !body.firstName ||
        !body.lastName ||
        !body.email ||
        !body.gender ||
        !body.jobTitle
    ) {
        return res.status(400).json({ msg: "All fields are req...." })
    }

    const result = await User.create({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        gender: body.gender,
        jobTitle: body.jobTitle
    });
    //    console.log(result)
    return res.status(201).json({ msg: "Success" });


    // users.push({...body , id: users.length + 1});
    // fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    //     // console.log("body",body)
    //     return res.json({status: "pending", id: users.length });
    // })

})


app.listen(PORT, () => console.log(`Server started at PORT ${PORT}`))