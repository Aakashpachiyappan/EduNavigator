import express from "express";
import Event from "../models/Event.js";

const eventRouter = express.Router();


eventRouter.post("/", async (req, res) => {
  try {
    const { title, description, date, location, image } = req.body;
    const newEvent = new Event({ title, description, date, location, image });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: "Error creating event", error });
  }
});


eventRouter.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 }); 
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error });
  }
});


eventRouter.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Error fetching event", error });
  }
});

eventRouter.delete("/:id", async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event", error });
  }
});


export default eventRouter;
