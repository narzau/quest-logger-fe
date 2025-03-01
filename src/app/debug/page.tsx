"use client";

// src/app/debug/page.tsx
import { useState } from "react";
import axios from "axios";

export default function DebugPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `${new Date().toISOString()}: ${message}`]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const testEndpoint = async (endpoint: string) => {
    setIsLoading(true);
    addLog(`Testing endpoint: ${endpoint}`);

    try {
      // Get the token
      const token = localStorage.getItem("auth_token");
      addLog(`Auth token found: ${token ? "Yes" : "No"}`);

      // Make direct fetch request to see raw network behavior
      addLog(`Sending fetch request to: ${endpoint}`);
      const fetchResponse = await fetch(`/api/v1${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
          // Add a cache buster
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      addLog(`Fetch response status: ${fetchResponse.status}`);
      addLog(`Fetch response URL: ${fetchResponse.url}`); // This shows if there was a redirect

      // Try to read the response body
      let responseText = "";
      try {
        responseText = await fetchResponse.text();
        addLog(
          `Response body: ${responseText.substring(0, 100)}${
            responseText.length > 100 ? "..." : ""
          }`
        );
      } catch (e) {
        addLog(`Error reading response body: ${e}`);
      }

      // Now try with axios for comparison
      addLog(`Sending axios request to: ${endpoint}`);
      const axiosResponse = await axios.get(`/api/v1${endpoint}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
        // This is important - don't let axios auto-follow redirects
        maxRedirects: 0,
        validateStatus: function (status) {
          return status >= 200 && status < 400; // Accept 3xx redirects as success
        },
      });

      addLog(`Axios response status: ${axiosResponse.status}`);
      addLog(
        `Axios response headers: ${JSON.stringify(axiosResponse.headers)}`
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      addLog(`Error: ${error.message}`);
      if (error.response) {
        addLog(`Response status: ${error.response.status}`);
        addLog(`Response headers: ${JSON.stringify(error.response.headers)}`);
        addLog(`Response data: ${JSON.stringify(error.response.data)}`);
      }
      if (error.request) {
        addLog(`Request info: ${JSON.stringify(error.request)}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const testUserMe = () => testEndpoint("/users/me");
  const testQuests = () => testEndpoint("/quests");

  // Simple form to test arbitrary endpoints
  const [customEndpoint, setCustomEndpoint] = useState("");
  const testCustomEndpoint = () => {
    if (customEndpoint) {
      testEndpoint(
        customEndpoint.startsWith("/") ? customEndpoint : `/${customEndpoint}`
      );
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">API Debugging Tool</h1>

      <div className="mb-4 flex gap-2">
        <button
          onClick={testUserMe}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Test /users/me
        </button>

        <button
          onClick={testQuests}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Test /quests
        </button>

        <button
          onClick={clearLogs}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Clear Logs
        </button>
      </div>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={customEndpoint}
          onChange={(e) => setCustomEndpoint(e.target.value)}
          placeholder="Custom endpoint (e.g. /achievements)"
          className="px-4 py-2 border rounded flex-grow"
        />

        <button
          onClick={testCustomEndpoint}
          disabled={isLoading || !customEndpoint}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Test Custom
        </button>
      </div>

      <div className="bg-black text-green-400 p-4 rounded h-96 overflow-auto font-mono text-sm">
        {logs.length === 0 ? (
          <div className="text-gray-500">
            Click a button to test an endpoint...
          </div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="mb-1">
              {log}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
