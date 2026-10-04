import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getActivity, deleteActivity } from "../api/activities";
import { useAuth } from "../auth/AuthContext";

/** Shows details about a single activity. Logged-in users can delete it. */
export default function ActivityDetails() {
  const { activityId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [activity, setActivity] = useState(null);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    const syncActivity = async () => {
      try {
        const data = await getActivity(activityId);
        setActivity(data);
      } catch (e) {
        setError(e.message);
      }
    };
    syncActivity();
  }, [activityId]);

  const tryDelete = async () => {
    setDeleteError(null);
    try {
      await deleteActivity(token, activity.id);
      navigate("/activities");
    } catch (e) {
      setDeleteError(e.message);
    }
  };

  if (error) return <p role="alert">{error}</p>;
  if (!activity) return <p>Loading...</p>;

  return (
    <article>
      <h1>{activity.name}</h1>
      <p>by {activity.creatorName}</p>
      <p>{activity.description}</p>
      {token && <button onClick={tryDelete}>Delete</button>}
      {deleteError && <p role="alert">{deleteError}</p>}
    </article>
  );
}
