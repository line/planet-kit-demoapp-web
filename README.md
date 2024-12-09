# LINE Planet Call for Web

LINE Planet Call is a demo app for LINE Planet, a cloud-based real-time communications platform as a service (CPaaS).

LINE Planet Call showcases the key features of LINE Planet, including 1-to-1 and group call functionalities. It can help you understand how to integrate LINE Planet into your services and enhance productivity when you implement your own app.

## Features

LINE Planet Call provides the following features:

-   **Group call**
    -   Pre-check the camera and mic before a group call
    -   Create a group video call room
    -   Join a group video call room
    -   Leave a group video call room
-   **Basic features**
    -   Mute/unmute the mic
    -   Enable/disable the camera
    -   Select camera source
    -   Provide talker information
    -   Display the participant's name

## Run the demo

-   [Run demo](https://line-planet-call.lineplanet.me)

## Run the project

### Prerequisites

Before getting started with LINE Planet Call, do the following:

#### System requirements

-   Make sure that your system meets the [system requirements](https://docs.lineplanet.me/overview/specification/planetkit-system-requirements#web).
-   [Install Node.js](https://nodejs.org/en/download/current).
-   The specifications of the currently supported web browsers are as follows. If necessary, install a web browser or upgrade the version of your web browser.
    -   Chromium 72+ based browser
    -   Safari 14.5+ (Beta)

#### Mapping localhost to a LINE Planet Call domain

> In the actual implementation of your app, you have to ask us to register the domain you will serve.

-   To avoid [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) issues, you should use our domain registered for LINE Planet Call.
-   This involves modifying the `hosts` file on your system. Follow the instructions below based on your operating system:

-   For Windows users

    1. Open Notepad as an Administrator. You can do this by searching for Notepad in the Start menu, right-clicking on it, and selecting "Run as administrator".
    2. In Notepad, open the `hosts` file located at `C:\Windows\System32\drivers\etc\hosts`.
    3. Scroll to the bottom of the file and add the following line:

        ```
        127.0.0.1       line-planet-call-local.lineplanet.me
        ```

    4. Save the file and close Notepad.

-   For macOS users

    1. Open Terminal.
    2. Type the following command to open the `hosts` file in the nano editor (you can use any other text editor if you prefer):

        ```console
        $ sudo nano /etc/hosts
        ```

    3. You might be prompted to enter your password. Type it in, and then press Enter.
    4. Scroll to the bottom of the file and add the following line:

        ```
        127.0.0.1       line-planet-call-local.lineplanet.me
        ```

    5. Press `Ctrl + O` to save the file, then `Enter` to confirm, and `Ctrl + X` to exit nano.

After completing these steps, you will have successfully mapped the LINE Planet Call domain (`line-planet-call-local.lineplanet.me`) to your localhost (`127.0.0.1`).

<img src="/docs/images/hosts_file.png" width="400"/>

### Install the project

#### 1. Download source code

Clone this repository, or download this repository and unzip the files.

#### 2. Install dependencies

Before running the application, you must install the necessary dependencies. On the terminal, execute the following command:

```console
$ npm install
```

### Run the project

After installing the dependencies, you can start the application by running:

```console
$ npm run start-local
```

After starting the application, you can use the your LINE Planet Call at `https://line-planet-call-local.lineplanet.me:3000`.

## Limitations

In LINE Planet Call, each call is limited to a duration of five minutes. After five minutes, the call ends with the MAX_CALL_TIME_EXCEEDED disconnect reason.

## Issues and inquiries

Please file any issues or inquiries you have to our representative or [dl_planet_help@linecorp.com](mailto:dl_planet_help@linecorp.com). Your opinions are always welcome.

## FAQ

You can find answers to our frequently asked questions in the [FAQ](https://docs.lineplanet.me/help/faq) section.
