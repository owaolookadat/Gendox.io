"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DownloadButton from "@/components/DownloadButton";
import { generateMeetingMinutes } from "@/lib/generators/meeting-minutes";
import { saveAs } from "file-saver";

function todayString(): string {
  return new Date().toISOString().split("T")[0];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function MeetingMinutesPage() {
  const [meetingTitle, setMeetingTitle] = useState("");
  const [date, setDate] = useState(todayString);
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [chairperson, setChairperson] = useState("");
  const [attendees, setAttendees] = useState("");
  const [absentees, setAbsentees] = useState("");
  const [agendaItems, setAgendaItems] = useState("");
  const [discussionPoints, setDiscussionPoints] = useState("");
  const [decisionsMade, setDecisionsMade] = useState("");
  const [actionItems, setActionItems] = useState("");
  const [nextMeetingDate, setNextMeetingDate] = useState("");

  const canDownload =
    meetingTitle.trim() !== "" &&
    date.trim() !== "" &&
    chairperson.trim() !== "" &&
    attendees.trim() !== "" &&
    agendaItems.trim() !== "";

  const handleDownload = async () => {
    const blob = await generateMeetingMinutes({
      meetingTitle,
      date,
      time,
      location,
      chairperson,
      attendees,
      absentees,
      agendaItems,
      discussionPoints,
      decisionsMade,
      actionItems,
      nextMeetingDate,
    });
    const filename = `meeting-minutes-${slugify(meetingTitle)}-${date}.docx`;
    saveAs(blob, filename);
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass =
    "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <ToolShell
      title="Meeting Minutes Generator"
      description="Create professional meeting minutes in minutes. Download as Word document instantly."
      category="Document Generator"
    >
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Meeting Details</h2>

        <div>
          <label className={labelClass}>Meeting Title</label>
          <input
            type="text"
            value={meetingTitle}
            onChange={(e) => setMeetingTitle(e.target.value)}
            placeholder="Weekly Team Standup"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Time</label>
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="10:00 AM"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Conference Room A / Zoom"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Chairperson</label>
            <input
              type="text"
              value={chairperson}
              onChange={(e) => setChairperson(e.target.value)}
              placeholder="John Smith"
              className={inputClass}
            />
          </div>
        </div>

        <h2 className="text-lg font-semibold text-gray-900 pt-2">Participants</h2>

        <div>
          <label className={labelClass}>
            Attendees{" "}
            <span className="text-gray-400 font-normal">(one per line)</span>
          </label>
          <textarea
            value={attendees}
            onChange={(e) => setAttendees(e.target.value)}
            placeholder={"John Smith\nJane Doe\nBob Wilson"}
            rows={4}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>
            Absentees{" "}
            <span className="text-gray-400 font-normal">(optional, one per line)</span>
          </label>
          <textarea
            value={absentees}
            onChange={(e) => setAbsentees(e.target.value)}
            placeholder="Alice Johnson"
            rows={2}
            className={inputClass}
          />
        </div>

        <h2 className="text-lg font-semibold text-gray-900 pt-2">Meeting Content</h2>

        <div>
          <label className={labelClass}>Agenda Items</label>
          <textarea
            value={agendaItems}
            onChange={(e) => setAgendaItems(e.target.value)}
            placeholder={"1. Review previous action items\n2. Project updates\n3. Any other business"}
            rows={4}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Discussion Points</label>
          <textarea
            value={discussionPoints}
            onChange={(e) => setDiscussionPoints(e.target.value)}
            placeholder="Summary of key discussion points..."
            rows={4}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Decisions Made</label>
          <textarea
            value={decisionsMade}
            onChange={(e) => setDecisionsMade(e.target.value)}
            placeholder="Key decisions agreed upon..."
            rows={4}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Action Items</label>
          <textarea
            value={actionItems}
            onChange={(e) => setActionItems(e.target.value)}
            placeholder={"John - Complete project report by Friday\nJane - Schedule client meeting"}
            rows={4}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>
            Next Meeting Date{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="date"
            value={nextMeetingDate}
            onChange={(e) => setNextMeetingDate(e.target.value)}
            className={inputClass}
          />
        </div>

        <DownloadButton onClick={handleDownload} disabled={!canDownload} />
      </div>
    </ToolShell>
  );
}
