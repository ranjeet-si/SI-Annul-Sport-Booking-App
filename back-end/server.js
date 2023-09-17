require("dotenv").config();
const express = require("express");
const db = require("./db")
const cors = require('cors');
const router = express.Router();
const app = express();

app.use(express.json());

app.use(cors());



app.post("/api/v1/Hrlogin", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await db.query(
      "SELECT * FROM Users WHERE Username = $1 AND Password = $2 AND Role = 'hr'",
      [username, password]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({
        status: "error",
        message: "Invalid username, password, or role.",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        user: user.rows[0],
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while logging in.",
    });
  }
});


app.post("/api/v1/Employeelogin", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await db.query(
      "SELECT * FROM Users WHERE Username = $1 AND Password = $2 AND Role = 'employee'",
      [username, password]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({
        status: "error",
        message: "Invalid username, password, or role.",
      });
    }

    const userId = user.rows[0].user_id; // Extract the userId from the user data

    res.status(200).json({
      status: "success",
      data: {
        user: {
          userId, // Include the userId in the response
          ...user.rows[0], // Include other user information if needed
        },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while logging in.",
    });
  }
});


app.get("/api/v1/getUserDetails/:username", async (req, res) => {
  const username = req.params.username;
  console.log(username)
  try {
    const user = await db.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "User not found.",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        user: user.rows[0],
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching user details.",
    });
  }
});




/*-------------------For hr -------------------------------------*/

app.get("/api/venues", async (req, res) => {
  try {
    const venuesData = await db.query(`
      SELECT venueid, venuename
      FROM venues;
    `);

    res.json({
      status: 'success',
      data: {
        venues: venuesData.rows,
      },
    });
  } catch (error) {
    console.error('Error fetching venues:', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});



app.get("/api/venuesports/:venueid", async (req, res) => {
  const { venueid } = req.params;

  try {
    const sportsData = await db.query(`
      SELECT vs.venuesportid, vs.sportid, s.sportname
      FROM venuesports vs
      JOIN sports s ON vs.sportid = s.sportid
      WHERE vs.venueid = $1;
    `, [venueid]);

    res.json({
      status: 'success',
      data: {
        venuesports: sportsData.rows,
      },
    });
  } catch (error) {
    console.error('Error fetching sports for venue:', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});



app.get("/api/equipment/:sportid", async (req, res) => {
  const { sportid } = req.params;

  try {
    const equipmentData = await db.query(`
    SELECT vs.*, s.sportname
    FROM venuesports vs
    JOIN sports s ON vs.sportid = s.sportid
    WHERE vs.venueid = $1;
    `, [sportid]);

    res.json({
      status: 'success',
      data: {
        equipment: equipmentData.rows,
      },
    });
  } catch (error) {
    console.error('Error fetching equipment for sport:', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});


// Create a booking
router.post('/', async (req, res) => {
  const {
    user_id,
    venue_id,
    sport_id,
    equipment_ids,
    start_time,
    end_time,
    status
  } = req.body;

  try {
    // Assuming you have a bookings table with appropriate columns
    const booking = await db.query(`
      INSERT INTO bookings (user_id, venue_id, sport_id, start_time, end_time, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `, [user_id, venue_id, sport_id, start_time, end_time, status]);

    // Insert equipment into equipment_inventory table
    for (const equipment_id of equipment_ids) {
      await db.query(`
        INSERT INTO equipment_inventory (booking_id, equipment_id)
        VALUES ($1, $2);
      `, [booking.rows[0].booking_id, equipment_id]);
    }

    res.json({
      status: 'success',
      data: {
        booking: booking.rows[0]
      }
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

module.exports = router;



app.get("/api/v1/getAllVenue", async (req, res)=>{
  try {
    
    const vanueData = await db.query(
      "select * from venues ;"
    );
      console.log("connected");
    res.status(200).json({
      status: "success",
      data: {
        vanue: vanueData.rows,
      },
    });
    console.log()
  } catch (err) {
    console.log(err);
  }
});


app.get("/api/v1/getVenue/:id", async (req, res) => {
  console.log(req.params.id);

  try {
    const vanue = await db.query(
      "select * from venues where venueid = req.params.id",
      [req.params.id]
    );
    
 

    res.status(200).json({
      status: "succes",
      data: {
        vanue: vanue.rows[0]
        
      },
    });
  } catch (err) {
    console.log(err);
  }
});





app.post("/api/v1/createVenue", async (req, res) => {
  const { venueID,venueName, sportName, maxCapacity, durationInMinutes } = req.body;

  try {
    const results = await db.query(
      "INSERT INTO Venues (venueid, venuename, sportname, maxcapacity, durationinminutes) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [venueID, venueName, sportName, maxCapacity, durationInMinutes]
    );

    res.status(201).json({
      status: "success",
      data: {
        venue: results.rows[0],
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while creating the venue.",
    });
  }
});


app.put("/api/v1/updateVenue/:venueId", async (req, res) => {
  const venueID = req.params.venueId;
  const { venueName, sportName, maxCapacity, durationInMinutes } = req.body;

  try {
    const results = await db.query(
      "UPDATE Venues SET VenueName = $1, SportName = $2, MaxCapacity = $3, DurationInMinutes = $4 WHERE VenueID = $5 RETURNING *",
      [venueName, sportName, maxCapacity, durationInMinutes, venueID]
    );

    if (results.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Venue not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        venue: results.rows[0],
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while updating the venue.",
    });
  }
});


//Add Equipment
app.post("/api/v1/addEquipment",cors(), async (req, res) => {
  const { equipmentId, equipmentName, quantityAvailable } = req.body;
   console.log(req.body);
   
  try {
    const results = await db.query(
      "INSERT INTO equipment (equipmentid, equipmentname,  quantityavailable) VALUES ($1, $2, $3) RETURNING *",
      [equipmentId, equipmentName, quantityAvailable]
    );

    res.status(201).json({
      status: "success",
      data: {
        equipment: results.rows[0],
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while adding equipment.",
    });
  }
});









app.put("/api/v1/UpdateVenue/:id", async (req, res) => {
  try {
    const results = await db.query(
      "UPDATE venues SET name = $1, sport = $2, max_capacity = $3,duration=$4 where id = $4 returning *",
      [req.body.name, req.body.sport, req.body.max_capacity, req.body.duration]
    );

    res.status(200).json({
      status: "succes",
      data: {
        retaurant: results.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
  console.log(req.params.id);
  console.log(req.body);
});

app.delete("/api/v1/deleteVanue/:id", async (req, res) => {
  try {
    const results = db.query("DELETE FROM vanue where id = $1", [
      req.params.id,
    ]);
    res.status(204).json({
      status: "sucess",
    });
  } catch (err) {
    console.log(err);
  }
});

const port = process.env.PORT || 3002   ;
app.listen(port, ()=>{
    console.log(`server is running at port ${port}`);
 
});


app.post("/api/v1/addBooking", async (req, res) => {
  const { userId, venueId, equipmentId, startTime,endTime } = req.body;

  try {
    // Assuming you have a database table named "Bookings" with appropriate columns
    const results = await db.query(
      "INSERT INTO bookings (userid, venueid, equipmentid, starttime, endtime) VALUES ($1, $2, $3, $4,$5) RETURNING *",
      [userId, venueId, equipmentId, startTime,endTime]
    );

    res.status(201).json({
      status: "success",
      data: {
        booking: results.rows[0],
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while adding the booking.",
    });
  }
});


app.post('/api/v1/addVenueAndSports', async (req, res) => {
  const { venueName, sports } = req.body;

  try {
    await db.query('BEGIN');

    // Insert the venue into Venues table
    const venueResult = await db.query(
      'INSERT INTO Venues (VenueName) VALUES ($1) RETURNING VenueID',
      [venueName]
    );
    const venueID = venueResult.rows[0].venueid;

    // Insert each sport into VenueSports table
    for (const sport of sports) {
      await db.query(
        'INSERT INTO VenueSports (VenueID, SportName, StartTime, EndTime) VALUES ($1, $2, $3, $4)',
        [venueID, sport.sportName, sport.startTime, sport.endTime]
      );
    }

    await db.query('COMMIT');
    res.status(201).json({ success: true });
  } catch (error) {
    await db.query('ROLLBACK');
    res.status(500).json({ success: false, error: error.message });
  }
});

// for booking request

app.get("/api/v1/getBookings", async (req, res) => {
  try {
    const bookingData = await db.query(`
      SELECT * FROM bookings;
    `);

    res.json({
      status: 'success',
      data: {
        bookings: bookingData.rows,
      },
    });
  } catch (error) {
    console.error('Error fetching booking data:', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

app.put("/api/v1/updateBookingStatus/:bookingId", async (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body;

  try {
    // Validate the status value (optional)
    if (status !== 'approved' && status !== 'rejected') {
      throw new Error('Invalid status value');
    }

    const updateQuery = `
      UPDATE bookings 
      SET status = $1
      WHERE bookingid = $2
    `;

    await db.query(updateQuery, [status, bookingId]);

    res.json({
      status: 'success',
      message: `Booking status updated to ${status}`,
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

 

//----------------------------------------


app.get("/api/v1/getBookings/:userId", async (req, res) => {
  const { userId } = req.params;
console.log(userId)
  try {
    const bookingsData = await db.query(`
      SELECT b.bookingid, v.venuename, s.sportname, b.starttime, b.endtime, b.status
      FROM bookings b
      JOIN venues v ON b.venueid = v.venueid
      JOIN sports s ON b.sportid = s.sportid
      WHERE b.user_id = $1;
    `, [1]);

    res.json({
      status: 'success',
      data: {
        bookings: bookingsData.rows,
      },
    });
  } catch (error) {
    console.error('Error fetching bookings for user:', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});


