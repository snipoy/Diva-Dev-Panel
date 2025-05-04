# Docker Status Dashboard 
### <span style="color: #EF4444;">(*Rejected by Development Team*)</span>

A dashboard for managing Diva's servers with real-time monitoring and container controls.

## Overview

This dashboard is a specialized monitoring solution developed by Pixii Development for the Diva Music Bot infrastructure. It provides real-time insights into server performance, resource utilization, and system health through an intuitive web interface.

## Features

- Real-time server status monitoring
- Resource usage tracking (CPU, Memory, Disk)
- Server control interface
- Secure authentication system
- Modern, responsive UI

## Development Notice

This project was rejected by team and is no longer actively maintained. While the code remains open source under GPL-3.0, please note that:

- This dashboard was specifically tailored for the Diva Music Bot infrastructure
- Self-hosting support is not provided
- Issues and feature requests will not be addressed
- Custom deployments are not officially supported

## License

This project is licensed under the GNU General Public License v3.0 (GPL-3.0) - see the [LICENSE](LICENSE) file for details.

## Contributing

As the development for this dashboard is no longer active, contributions will not be reviewed or merged. While the code remains open source under GPL-3.0, we recommend forking the repository for any custom modifications or use cases.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Access to a Pterodactyl panel with API credentials

## Installation

1. Clone the repository:
```bash
git clone https://github.com/snipoy/Diva-Dev-Panel.git
cd diva-dev-status-dashboard
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the following variables:
     ```
     REACT_APP_PTERODACTYL_URL=your-pterodactyl-panel-url
     REACT_APP_PTERODACTYL_API_KEY=your-api-key
     ```

4. Start the development server:
```bash
npm start
# or
yarn start
```

## Usage

1. Log in using your credentials
2. Navigate through the dashboard using the sidebar
3. Monitor server status and resources
4. Manage containers with simple start/stop/restart controls

## Security

- Never commit your `.env` file
- Keep your API keys secure
- Use environment variables for sensitive information
- Regularly update dependencies

## Support

For support and to stay updated with the latest developments, join our Discord server:

[![Discord](https://img.shields.io/discord/1000510031176941648?color=7289da&label=Discord&logo=discord&logoColor=white)](https://discord.gg/WTpS7FXyAp)

Our developers are ready to help with any questions you may have about this dashboard.