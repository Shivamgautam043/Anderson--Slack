import type { ActionFunction } from "@remix-run/node";
import {
  getErrorFromUnknown,
  getObjectFromUnknown,
  getStringFromUnknown,
} from "~/global-common-typescript/utilities/typeValidationUtilities";
import { getRequiredEnvironmentVariable } from "~/common-remix--utilities/utilities.server";
import { getPostgresDatabaseManager } from "~/common--database-manager--postgres/postgresDatabaseManager.server";

const toTitleCase = (text: string) => {
  return text
    .replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    )
    .replace(/_/g, " ");
};

async function sendSlackMessagesAllTasks(
  token: string,
  userSlackId: string,
  resultTasks: any
): Promise<void> {
  try {
    for (let i = 0; i < resultTasks.rows.length; i++) {
      const task = resultTasks.rows[i];
      await sendSlackMessage(
        token,
        userSlackId,
        task.title,
        task.priority,
        task.status,
        i + 1
      );
    }
  } catch (error) {
    console.error("Error sending Slack messages:", error);
    throw error;
  }
}

async function sendSlackMessageHello(
  token: string,
  channel: string
): Promise<void> {
  try {
    const message = {
      channel: channel,
      blocks: [
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `Hey <@${channel}>:wave: Here's your requested task list :clipboard:`,
            },
            {
              type: "image",
              image_url:
                "https://em-content.zobj.net/source/animated-noto-color-emoji/356/dog_1f415.gif",
              alt_text: "cute Dog",
            },
          ],
        },
      ],
    };

    const response = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(message),
    });

    const data = await response.json();
    if (!data.ok) {
      throw new Error(`Failed to send message: ${data.error}`);
    }
  } catch (error) {
    console.error("Error sending Slack message:", error);
    throw error;
  }
}

async function sendSlackMessageHeader(
  token: string,
  channel: string,
  project: string,
  task: string,
  priority: string,
  statuss: string
): Promise<void> {
  const projectSpace = 40 - project.length;
  const taskSpace = 50 - task.length;
  const prioritySpace = 10 - priority.length;
  const statussSpace = 20 - statuss.length;
  let projectSpaces = "";
  let taskSpaces = "";
  let prioritySpaces = "";
  let statussSpaces = "";

  for (let i = 0; i < projectSpace; i++) {
    projectSpaces += " ";
  }
  for (let i = 0; i < prioritySpace; i++) {
    prioritySpaces += " ";
  }
  for (let i = 0; i < statussSpace; i++) {
    statussSpaces += " ";
  }
  for (let i = 0; i < taskSpace; i++) {
    taskSpaces += " ";
  }

  try {
    const message = {
      channel: channel,
      blocks: [
        {
          type: "rich_text",
          elements: [
            {
              type: "rich_text_preformatted",
              border: 0,
              elements: [
                {
                  type: "text",
                  text: `Sr.No.  ${project}${projectSpaces}${task}${taskSpaces}${priority}${prioritySpaces}         ${statuss}${statussSpaces}`,
                },
              ],
            },

            {
              type: "rich_text_section",
              elements: [],
            },
          ],
        },
      ],
    };

    const response = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(message),
    });

    const data = await response.json();
    if (!data.ok) {
      throw new Error(`Failed to send message: ${data.error}`);
    }
  } catch (error) {
    console.error("Error sending Slack message:", error);
    throw error;
  }
}

async function sendSlackMessage(
  token: string,
  channel: string,
  task: string,
  priority: string,
  statuss: string,
  srNO: number
): Promise<void> {
  let priorityEmogi = "🔴";
  if (priority == "MEDIUM") {
    priorityEmogi = "🟡";
  }
  if (priority == "LOW") {
    priorityEmogi = "🟢";
  }

  let statusEmogi = "🚧";
  if (statuss == "TO-DO") {
    statusEmogi = "📝";
  } else if (statuss == "IN-PROGRESS") {
    statusEmogi = "👨🏻‍💻";
  }
  const truncateString = (str: string, maxLength: number): string => {
    if (str.length > maxLength) {
      return str.slice(0, maxLength) + "...";
    }
    return str;
  };
  const truncatedTask = truncateString(task, 45);

  const postgresDatabaseManager = await getPostgresDatabaseManager(null);
  if (postgresDatabaseManager instanceof Error) {
    throw new Error("Error connecting to database");
  }

  const projectName = await postgresDatabaseManager.execute(
    `
    
        SELECT DISTINCT projects.name
        FROM tasks
        JOIN projects ON projects.id = tasks.project
        WHERE title = $1
`,
    [task]
  );
  if (projectName instanceof Error) {
    throw new Error("Error querying database");
  }

  let newProject;
  
  if(projectName.rows[0]){
    newProject=projectName.rows[0].name;
  }else{
    newProject='Project';
  }
  
  
 
  console.log(newProject);
  const truncatedProject = truncateString(newProject, 35);
  console.log(truncatedProject);

  const projectSpace = 45 - truncatedProject.length;
  const taskSpace = 50 - truncatedTask.length;
  const prioritySpace = 10 - priority.length;
  const statussSpace = 20 - statuss.length;
  const srNoSpace = 6 - srNO.toString().length;
  let projectSpaces = "";
  let taskSpaces = "";
  let prioritySpaces = "";
  let statussSpaces = "";
  let srNoSpaces = "";

  for (let i = 0; i < projectSpace; i++) {
    projectSpaces += " ";
  }
  for (let i = 0; i < prioritySpace; i++) {
    prioritySpaces += " ";
  }
  for (let i = 0; i < statussSpace; i++) {
    statussSpaces += " ";
  }
  for (let i = 0; i < taskSpace; i++) {
    taskSpaces += " ";
  }
  for (let i = 0; i < srNoSpace; i++) {
    srNoSpaces += " ";
  }

  try {
    const message = {
      channel: channel,
      blocks: [
        {
          type: "rich_text",
          elements: [
            {
              type: "rich_text_preformatted",
              border: 0,
              elements: [
                {
                  type: "text",
                  text: ` ${srNO}${srNoSpaces} ${truncatedProject}${projectSpaces}${truncatedTask}${taskSpaces}${priorityEmogi}${toTitleCase(
                    priority
                  )}${prioritySpaces}      ${statusEmogi} ${toTitleCase(
                    statuss
                  )}${statussSpaces}`,
                },
              ],
            },

            {
              type: "rich_text_section",
              elements: [],
            },
          ],
        },
      ],
    };

    const response = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(message),
    });

    const data = await response.json();
    if (!data.ok) {
      throw new Error(`Failed to send message: ${data.error}`);
    }
  } catch (error) {
    console.error("Error sending Slack message:", error);
    throw error;
  }
}

export const action: ActionFunction = async ({ request }) => {
  try {
    console.log("action run");
    const body = await request.formData();
    const payload = getObjectFromUnknown(body.get("payload"));
    const userSlackId = payload.userId;
    const userPriority = payload.priority;
    console.log(userPriority);
    console.log(userSlackId);
    const token: string = getRequiredEnvironmentVariable("SLACK_AUTH_TOKEN");

    const postgresDatabaseManager = await getPostgresDatabaseManager(null);
    if (postgresDatabaseManager instanceof Error) {
      throw new Error("Error connecting to database");
    }
   
    const resultUsersId = await postgresDatabaseManager.execute(
      `SELECT full_name, id FROM employees
        WHERE
        slack_user_id = $1`,
      [userSlackId]
    );
    if (resultUsersId instanceof Error) {
      throw new Error("Error querying database collecting Id from slack id");
    }

    const employeeID = resultUsersId.rows[0].id;

    console.log("Employee Id"+employeeID);

    let resultTasks;
    if (userPriority == "All"||"all"||"ALL") {
      resultTasks = await postgresDatabaseManager.execute(
        `
              SELECT
                  title,priority,status
              FROM
                  tasks
              WHERE
              assigned_to = $1 AND
  
              status != 'DONE' 
        `,
        [employeeID]
      );
      if (resultTasks instanceof Error) {
        throw new Error("Error querying database");
      }
    } else {
      resultTasks = await postgresDatabaseManager.execute(
        `
              SELECT
                  title,priority,status
              FROM
                  tasks
              WHERE
              assigned_to = $1 AND
              priority = $2 AND
              status != 'DONE' 
           
        `,
        [employeeID,userPriority]
      );
      if (resultTasks instanceof Error) {
        throw new Error("Error querying database");
      }
    }

    await sendSlackMessageHello(token, userSlackId);

    await sendSlackMessageHeader(
      token,
      userSlackId,
      "Project",
      "Task",
      "Priority",
      "Status"
    );

    sendSlackMessagesAllTasks(token, userSlackId, resultTasks);

    return new Response(
      JSON.stringify({
        response: "OK",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          f,
        },
      }
    );
  } catch (error: unknown) {
    const error_ = getErrorFromUnknown(error);
    return new Response(error_.message, { status: 500 });
  }
};
