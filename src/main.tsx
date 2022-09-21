import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";
import "./index.css";
import Root, { loader as rootLoader, action as rootAction, } from "./routes/root";
import ErrorPage from "./views/errorPage";
import Contact, {
  loader as contactLoader,
  action as contactAction,
} from "./routes/contact";
import EditContact, {
  action as editAction,
} from "./routes/edit";
import { action as destroyAction } from "./routes/destroy";
import Index from "./routes/index";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: rootAction,
    children: [
      { index: true, element: <Index /> },
      {
        path: "contacts/:contactId",
        element: <Contact />,
        loader: contactLoader,
        action: contactAction,
      },
      {
        path: "contacts/:contactId/edit",
        element: <EditContact />,
        action: editAction,
        loader: contactLoader,
      },
      {
        path: "contacts/:contactId/destroy",
        action: destroyAction,
        errorElement: <div>Oops! There was an error.</div>
      },
    ],
  }
]);
// const router = <Route
//   path="/"
//   element={<Root />}
//   loader={rootLoader}
//   action={rootAction}
//   errorElement={<ErrorPage />}
// >
//   <Route
//     index
//     element={<Index />}
//     errorElement={<ErrorPage />}
//   />
//   <Route
//     path="contacts/:contactId"
//     element={<Contact />}
//     loader={contactLoader}
//     action={contactAction}
//     errorElement={<ErrorPage />}
//   />
//   <Route
//     path="contacts/:contactId/edit"
//     element={<EditContact />}
//     loader={contactLoader}
//     action={editAction}
//     errorElement={<ErrorPage />}
//   />
//   <Route
//     path="contacts/:contactId/destroy"
//     action={destroyAction}
//     errorElement={<ErrorPage />}
//   />
// </Route>
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);