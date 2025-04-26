import React, { useState } from 'react';
import { motion } from 'framer-motion';

const DeviceIntegration = () => {
  const [connectedDevices, setConnectedDevices] = useState([
    { id: 1, name: 'Fitbit Sense', type: 'watch', status: 'connected', lastSync: '10 minutes ago' }
  ]);

  const availableDevices = [
    { id: 'fitbit', name: 'Fitbit', icon: 'M12 2.5a9.5 9.5 0 100 19 9.5 9.5 0 000-19zM12 20a8 8 0 110-16 8 8 0 010 16zm-4-8a1 1 0 011-1h6a1 1 0 110 2H9a1 1 0 01-1-1z', },
    { id: 'apple', name: 'Apple Watch', icon: 'M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z', },
    { id: 'garmin', name: 'Garmin', icon: 'M12 14l9-5-9-5-9 5 9 5z' },
    { id: 'polar', name: 'Polar', icon: 'M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z', },
    { id: 'samsung', name: 'Samsung', icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z', },
    { id: 'withings', name: 'Withings', icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z', }
  ];

  const apps = [
    { id: 'strava', name: 'Strava', icon: 'M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3', status: 'connected' },
    { id: 'myfitnesspal', name: 'MyFitnessPal', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z', status: 'connected' },
    { id: 'google_fit', name: 'Google Fit', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', status: '' },
    { id: 'apple_health', name: 'Apple Health', icon: 'M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z', status: '' }
  ];

  const handleConnectDevice = (device) => {
    // In a real app, this would trigger device pairing
    alert(`Connecting to ${device.name}... (This would launch a pairing flow in a real app)`);
  };

  const handleDisconnectDevice = (deviceId) => {
    // In a real app, this would disconnect the device
    setConnectedDevices(prev => prev.filter(device => device.id !== deviceId));
    alert('Device disconnected');
  };

  const handleAppConnect = (app) => {
    // In a real app, this would trigger OAuth flow
    alert(`Connecting to ${app.name}... (This would launch an OAuth flow in a real app)`);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Device & App Integration</h2>
      
      {/* Connected Devices Section */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Connected Devices</h3>
        
        {connectedDevices.length === 0 ? (
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No devices connected</h3>
            <p className="mt-1 text-sm text-gray-500">Connect a device to track your workouts and activity.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {connectedDevices.map((device) => (
              <motion.div
                key={device.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium">{device.name}</h4>
                      <div className="flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                        <span className="text-sm text-gray-500">Last sync: {device.lastSync}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDisconnectDevice(device.id)}
                    className="ml-4 text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    Disconnect
                  </button>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Data synced:</span>
                    <span className="font-medium">Steps, Heart Rate, Workouts</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-600">Battery level:</span>
                    <span className="font-medium">82%</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      {/* Available Devices Section */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Connect a Device</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {availableDevices.map((device) => (
            <motion.div
              key={device.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 border border-gray-200 rounded-lg text-center cursor-pointer hover:border-blue-400 hover:shadow-sm transition-all"
              onClick={() => handleConnectDevice(device)}
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={device.icon} />
                </svg>
              </div>
              <h4 className="text-sm font-medium">{device.name}</h4>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* App Integrations Section */}
      <div>
        <h3 className="text-lg font-medium mb-4">App Integrations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {apps.map((app) => (
            <motion.div
              key={app.id}
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-white border border-gray-100 rounded-lg hover:shadow-sm transition-all"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={app.icon} />
                    </svg>
                  </div>
                  <h4 className="ml-3 font-medium">{app.name}</h4>
                </div>
                
                {app.status === 'connected' ? (
                  <div className="flex items-center text-green-600 text-sm">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Connected
                  </div>
                ) : (
                  <button
                    onClick={() => handleAppConnect(app)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Connect
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeviceIntegration; 