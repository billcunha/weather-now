import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import City from "./index";

let container = null;
beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);
});

afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

it("renders city data", async () => {
    const fakeCity = {
        id: 165,
        name: "Urubici",
        sys: {
            country: "BR",
        },
        main: {
            pressure: 15,
            temp: 53,
            humidity: 51,
        },
        address: "123, Charming Avenue",
        cod: 200,
    };

    jest.spyOn(global, "fetch").mockImplementation(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve(fakeCity)
        })
    );

    // Use the asynchronous version of act to apply resolved promises
    await act(async () => {
        render(<City item={{id: 3421319, clicked: true}} />, container);
    });

    expect(container.querySelector(".header").textContent).toBe(fakeCity.name + ", " + fakeCity.sys.country);
    expect(container.querySelector(".temperature").textContent).toBe(fakeCity.main.temp + "°");
    expect(container.querySelector(".pressure").textContent).toContain(fakeCity.main.pressure);
    expect(container.querySelector(".humidity").textContent).toContain(fakeCity.main.humidity);

    // remove the mock to ensure tests are completely isolated
    global.fetch.mockRestore();
});

it("renders city fail", async () => {
    jest.spyOn(global, "fetch").mockImplementation(() =>
        Promise.resolve({
            ok: false,
            json: () => Promise.resolve({})
        })
    );

    // Use the asynchronous version of act to apply resolved promises
    await act(async () => {
        render(<City item={{id: 651615}} />, container);
    });

    expect(container.querySelector(".box").textContent).toContain("Something went wrong");

    // remove the mock to ensure tests are completely isolated
    global.fetch.mockRestore();
});