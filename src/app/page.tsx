"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function Page() {
  const [characterName, setCharacterName] = useState("");
  const [apiKey, setApiKey] = useState(Cookies.get("api_key") || "");
  const [characters, setCharacters] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!apiKey) {
      alert("API 키를 입력하세요.");
    }
  }, [apiKey]);

  const handleApiKeySubmit = () => {
    if (apiKey) {
      Cookies.set("api_key", apiKey, { expires: 7 }); // 7일 동안 쿠키 저장
      alert("API 키가 저장되었습니다.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!apiKey) {
      setError("API 키가 없습니다. 먼저 API 키를 입력하세요.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/characters/${characterName}`, {
        headers: {
          "x-api-key": apiKey,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await res.json();
      setCharacters(data);
    } catch (err: any) {
      setError(err.message || "Error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 px-4">
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
          캐릭터 정보 검색
        </h1>

        {!apiKey && (
          <div className="mb-6">
            <input
              type="text"
              className="border border-gray-300 p-3 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="API 키를 입력하세요"
            />
            <button
              onClick={handleApiKeySubmit}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 w-full shadow-md transition"
            >
              API 키 저장
            </button>
          </div>
        )}

        {apiKey && (
          <form onSubmit={handleSubmit} className="flex gap-4 mb-8">
            <input
              type="text"
              className="flex-1 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              placeholder="닉네임을 입력하세요"
            />
            <button
              type="submit"
              className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 shadow-md transition"
            >
              검색
            </button>
          </form>
        )}

        {loading && (
          <div className="text-center text-gray-500 font-medium">
            로딩 중입니다...
          </div>
        )}
        {error && (
          <div className="text-center text-red-500 font-medium">{error}</div>
        )}

        {characters && characters.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white shadow-md mt-6">
              <thead>
                <tr className="bg-purple-500 text-white text-left">
                  <th className="py-3 px-4">서버명</th>
                  <th className="py-3 px-4">캐릭터 이름</th>
                  <th className="py-3 px-4">레벨</th>
                  <th className="py-3 px-4">클래스</th>
                  <th className="py-3 px-4">평균 아이템 레벨</th>
                  <th className="py-3 px-4">최대 아이템 레벨</th>
                </tr>
              </thead>
              <tbody>
                {characters.map((char, i) => (
                  <tr
                    key={i}
                    className={`${
                      i % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-purple-100 transition`}
                  >
                    <td className="py-3 px-4 border">{char.ServerName}</td>
                    <td className="py-3 px-4 border">{char.CharacterName}</td>
                    <td className="py-3 px-4 border">{char.CharacterLevel}</td>
                    <td className="py-3 px-4 border">
                      {char.CharacterClassName}
                    </td>
                    <td className="py-3 px-4 border">{char.ItemAvgLevel}</td>
                    <td className="py-3 px-4 border">{char.ItemMaxLevel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && characters.length === 0 && apiKey && (
          <div className="text-center text-gray-500 mt-6">
            닉네임을 검색하여 결과를 확인하세요.
          </div>
        )}
      </div>
    </div>
  );
}


