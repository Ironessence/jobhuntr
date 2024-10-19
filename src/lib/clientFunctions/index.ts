export const getUser = async (email: string) => {
  try {
    const response = await fetch(`/api/getUser/${email}`);
    if (!response.ok) throw new Error("Failed to fetch user");
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateCV = async (fileData: {
  fileName: string;
  fileType: string;
  fileData: string;
}) => {
  try {
    const response = await fetch("/api/update-cv", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fileData),
    });
    if (!response.ok) throw new Error("Failed to update CV");
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
