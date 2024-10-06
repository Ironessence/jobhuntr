export const getUser = async (email: string) => {
  try {
    const response = await fetch(`/api/getUser/${email}`);

    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateCV = async (cv: string, email: string) => {
  try {
    const response = await fetch("/api/update-cv", {
      body: JSON.stringify({ cv, email }),
      method: "POST",
    });
    if (!response.ok) {
      throw new Error("Failed to update CV");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update CV");
  }
};
