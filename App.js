import React, { useState } from "react";

export default function HairSalonScheduler() {
  const serviceList = [
    { label: "قص شعر", duration: 20 },
    { label: "غسل وتصفيف", duration: 30 },
    { label: "صبغ الشعر", duration: 60 },
  ];

  const [reservations, setReservations] = useState([]);
  const [chosenService, setChosenService] = useState(null);
  const [chosenTime, setChosenTime] = useState(null);

  const convertToMinutes = (timeString) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const timeSlots = [];
  for (let h = 9; h < 17; h++) {
    for (let m = 0; m < 60; m += 10) {
      const formatted = `${h.toString().padStart(2, "0")}:${m
        .toString()
        .padStart(2, "0")}`;
      timeSlots.push(formatted);
    }
  }

  const checkAvailability = (time, duration) => {
    const start = convertToMinutes(time);
    const end = start + duration;

    const overlapFound = reservations.some((r) => {
      const rStart = convertToMinutes(r.time);
      const rEnd = rStart + r.duration;
      const overlap = !(end <= rStart || start >= rEnd);
      return overlap;
    });

    return !overlapFound;
  };

  const handleReservation = () => {
    if (!chosenService || !chosenTime) {
      alert("يرجى اختيار خدمة ووقت أولاً!");
      return;
    }

    if (!checkAvailability(chosenTime, chosenService.duration)) {
      alert("هذا الوقت محجوز مسبقًا!");
      return;
    }

    setReservations((prev) => [
      ...prev,
      {
        time: chosenTime,
        service: chosenService.label,
        duration: chosenService.duration,
      },
    ]);

    setChosenService(null);
    setChosenTime(null);
    alert("تم الحجز بنجاح ✅");
  };

  return (
    <div
      style={{ padding: "20px", fontFamily: "sans-serif", direction: "rtl" }}
    >
      <h2>💈 نظام حجز مواعيد الصالون</h2>

      <div>
        <h3>اختر الخدمة:</h3>
        <select
          value={chosenService ? chosenService.label : ""}
          onChange={(e) =>
            setChosenService(
              serviceList.find((srv) => srv.label === e.target.value)
            )
          }
        >
          <option value="">-- اختر خدمة --</option>
          {serviceList.map((srv) => (
            <option key={srv.label} value={srv.label}>
              {srv.label} ({srv.duration} دقيقة)
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3>اختر الوقت:</h3>
        <select
          value={chosenTime || ""}
          onChange={(e) => setChosenTime(e.target.value)}
        >
          <option value="">-- اختر وقتًا --</option>
          {timeSlots.map((slot) => (
            <option
              key={slot}
              value={slot}
              disabled={
                chosenService &&
                !checkAvailability(slot, chosenService.duration)
              }
            >
              {slot}
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleReservation} style={{ marginTop: "10px" }}>
        تأكيد الحجز
      </button>

      <h3>قائمة الحجوزات الحالية:</h3>
      <ul>
        {reservations.map((r, i) => (
          <li key={i}>
            {r.service} - {r.time} ({r.duration} دقيقة)
          </li>
        ))}
      </ul>
    </div>
  );
}
