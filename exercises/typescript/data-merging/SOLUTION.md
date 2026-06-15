# Data merging - Solution

The main invariant is one output row per user, stored at the position of that user's first appearance.

Walk the input once from left to right and maintain two structures:

1. results, which preserves output order.

2. sessionsForUser, a map from user to the merged row that already lives inside results.

When a user appears for the first time, create a new merged row, store it in both places, and convert its `equipment` list into a `Set` so later duplicates are easy to union. When the same user appears again, look up that existing row in O(1) time and update only the cloned row: add the new `duration` and insert the new equipment values into the set.

Because the map and `results` both point at the same merged object, updates automatically land in the earliest row for that user. Once the scan finishes, convert each equipment set back into a sorted array before returning.

```typescript
type Session = { user: number; duration: number; equipment: Array<string> };

export default function mergeData(sessions: Array<Session>): Array<Session> {
  const results: Array<{
    user: number;
    duration: number;
    equipment: Set<string>;
  }> = [];
  // Point each user id at the cloned session already stored in `results`.
  const sessionsForUser = new Map();

  sessions.forEach((session) => {
    if (sessionsForUser.has(session.user)) {
      const userSession = sessionsForUser.get(session.user);
      userSession.duration += session.duration;
      session.equipment.forEach((equipment) => {
        userSession.equipment.add(equipment);
      });
    } else {
      const clonedSession = {
        ...session,
        // Use a Set internally so repeated equipment is deduplicated while merging.
        equipment: new Set(session.equipment),
      };
      sessionsForUser.set(session.user, clonedSession);
      results.push(clonedSession);
    }
  });

  // Convert the internal Set back to the sorted array shape expected by callers.
  return results.map((session) => ({
    ...session,
    equipment: Array.from(session.equipment).sort(),
  }));
}
```

Techniques

- Familiarity with JavaScript data structures like Arrays, Maps, and Sets.
