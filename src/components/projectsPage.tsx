import { ReactElement, useEffect, useState } from "react";
import { usePresence } from "@wyre-client/core";

export default ({ children }: { children: ReactElement }): ReactElement => {
  const presence = usePresence();
  const [presenceDetails, setPresenceDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const load = async () => {
    const userName = String(Math.random());
    const data = await presence.init({
      presenceId: "neoBrutalPortfolioEmjshrx",
    });
    setPresenceDetails(data);
    presence.add({ name: userName });
    setLoading(false);
  };

  if (loading) {
    load();
  }

  return (
    <main className="items-center justify-center h-screen flex flex-col bg-green">
      still under construction
      <div>
        {presenceDetails?.users.keys().map((userId: string) => {
          return (
            <>
              <div
                style={{
                  top: `${presenceDetails?.users[userId].mousePosition[0]}px`,
                  left: `${presenceDetails?.users[userId].mousePosition[1]}px`,
                }}
                className={` rounded-full w-10 h-10 bg-pink fixed top-[100px] z-50`}
              ></div>
              <div>{presenceDetails?.users[userId].name}</div>
            </>
          );
        })}
      </div>
      {children}
    </main>
  );
};
