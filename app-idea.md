Let's work on the further development of the app (Gatherpics).

Once you're inside the dashboard, so in app/dashboard, we should see the following:

A layout with a left menu on the side, and the main area on the left. The left menu should be responsive, so it should have a button to toggle it, hiding it on smaller screens when there is no need for it.

On the left menu, we should see the following:

The user's profile picture, with a dropdown menu on the right corner, with the following options:

- My Profile
- Settings
- Logout

Below the profile picture, we should see the user's username. If that doesn't exist, we should see something like "No username set".

Below the profile picture, we should see the menu. The menu should have the following options:

- My gathers
- Other gathers
- Saved Photos

The default for the route would be the "My gathers" page.

On the My gathers page (the default), we should check if the user has any gathers. If user.gathers is empty, we should see a button to create a new gather. If user.gathers is not empty, we should see a list of gathers. When clicking on a gather, we should redirect to /dashboard/gather/:id.
