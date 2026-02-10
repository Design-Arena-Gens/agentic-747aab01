import { act } from "@testing-library/react";
import { useNotesStore } from "./useNotesStore";

describe("useNotesStore", () => {
  beforeEach(() => {
    useNotesStore.setState({ notes: [] });
  });

  it("adds a note", () => {
    act(() => {
      useNotesStore.getState().addNote({
        title: "Test",
        content: "Details",
        tags: ["test"]
      });
    });

    const notes = useNotesStore.getState().notes;
    expect(notes).toHaveLength(1);
    expect(notes[0].title).toBe("Test");
  });

  it("updates a note", () => {
    let id = "";
    act(() => {
      useNotesStore.getState().addNote({
        title: "Original",
        content: "Initial",
        tags: []
      });
      id = useNotesStore.getState().notes[0].id;
      useNotesStore.getState().updateNote(id, {
        title: "Updated",
        content: "Changed"
      });
    });

    const note = useNotesStore.getState().notes[0];
    expect(note.title).toBe("Updated");
    expect(note.content).toBe("Changed");
  });
});
