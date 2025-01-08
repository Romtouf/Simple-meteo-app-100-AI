// import { render, waitFor, screen } from "@testing-library/react";
// import App from "./App";

// // Mock de la fonction de géolocalisation
// const mockGeolocation = {
//   getCurrentPosition: jest.fn().mockImplementation((success) =>
//     Promise.resolve(
//       success({
//         coords: {
//           latitude: 51.1,
//           longitude: 45.3,
//         },
//       })
//     )
//   ),
// };

// // Remplacer la fonction navigator.geolocation par notre mock
// global.navigator.geolocation = mockGeolocation;

// // Mock de la réponse de l'API OpenWeatherMap
// const mockWeatherData = {
//   name: "Test City",
//   sys: { country: "FR" },
//   main: { temp: 20 },
//   weather: [{ main: "Clear" }],
// };

// // Mock de la fonction fetch
// global.fetch = jest.fn().mockImplementation(() =>
//   Promise.resolve({
//     json: () => Promise.resolve(mockWeatherData),
//   })
// );

// test("renders learn react link", () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

// describe("App Component", () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   // Vos tests unitaires pour le composant App
//   it("renders loading spinner while fetching weather data", async () => {
//     render(<App />);
//     expect(screen.getByAltText("loader")).toBeInTheDocument();
//     await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
//   });

//   it("renders weather data correctly after fetching", async () => {
//     render(<App />);
//     await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
//     expect(screen.getByText("Météo")).toBeInTheDocument();
//     expect(screen.getByText("Test City")).toBeInTheDocument();
//     expect(screen.getByText("France")).toBeInTheDocument();
//     expect(screen.getByText("20 °C")).toBeInTheDocument();
//     expect(screen.getByText("Clear")).toBeInTheDocument();
//     expect(screen.getByAltText("Weather Icon")).toBeInTheDocument();
//   });
// });
