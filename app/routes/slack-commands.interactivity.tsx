import type { ActionFunction} from "@remix-run/node";
import {
  getErrorFromUnknown,
  getObjectFromUnknown,
  getStringFromUnknown,
} from "~/global-common-typescript/utilities/typeValidationUtilities";
import { getRequiredEnvironmentVariable } from "~/common-remix--utilities/utilities.server";
import { getPostgresDatabaseManager } from "~/common--database-manager--postgres/postgresDatabaseManager.server";

async function sendSlackMessagesAllTasks(
  token: string,
  userSlackId: string,
  projectName: string,
  resultTasks: any
): Promise<void> {
  try {
    for (let i = 0; i < resultTasks.rows.length; i++) {
      const task = resultTasks.rows[i];
      await sendSlackMessage(
        token,
        userSlackId,
        projectName,
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
              alt_text: "cute cat",
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
  project: string,
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
      return str.slice(0, maxLength)+"..."; 
    }
    return str; 
  };
  const truncatedTask = truncateString(task, 45);


  const projectSpace = 40 - project.length;
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
                  text: ` ${srNO}${srNoSpaces} ${project}${projectSpaces}${truncatedTask}${taskSpaces}${priorityEmogi}${priority}${prioritySpaces}      ${statusEmogi} ${statuss}${statussSpaces}`,
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

async function openModal(triggerId: string, view: any) {
  const body = new FormData();
  body.set("token", getRequiredEnvironmentVariable("SLACK_AUTH_TOKEN"));
  body.set("view", JSON.stringify(view));
  body.set("trigger_id", triggerId);
  body.set("notify_on_close", "true");

  const result = await fetch("https://slack.com/api/views.open", {
    method: "POST",
    body: body,
  });

  // const data = await result.text();
  // console.log(data);
  // console.log(body);
}

async function updateModal(view: any, viewId: string): Promise<void> {
  const body = new FormData();
  body.set("token", getRequiredEnvironmentVariable("SLACK_AUTH_TOKEN"));
  body.set("view", JSON.stringify(view));
  body.set("view_id", viewId);

  try {
    const response = await fetch("https://slack.com/api/views.update", {
      method: "POST",
      body: body,
    });

    const data = await response.json();
    if (!data.ok) {
      throw new Error(`Failed to update modal: ${data.error}`);
    }

    console.log("Modal updated successfully");
  } catch (error) {
    console.error("Error updating modal:", error);
    throw error;
  }
}

export const action: ActionFunction = async ({ request }) => {
  try {
    const body = await request.formData();
    const payload = getObjectFromUnknown(body.get("payload"));
    const postgresDatabaseManager = await getPostgresDatabaseManager(null);
    if (postgresDatabaseManager instanceof Error) {
      throw new Error("Error connecting to database");
    }

    const resultUsers = await postgresDatabaseManager.execute(
      `SELECT full_name, id FROM employees`
    );
    if (resultUsers instanceof Error) {
      throw new Error("Error querying database");
    }
    const modalUserInput = resultUsers.rows.map((user) => ({
      text: { type: "plain_text", text: user.full_name },
      value: user.id,
    }));

    if (payload.type === "view_submission") {
      // Handle view submission payload
      // Your existing view submission handling logic goes here
      console.log("modal submitted succesfully");
      console.log("modal submission chala");
      const userId =
        payload.view.state.values.user_input.user_input_action.selected_option
          .value;

      const projectId =
        payload.view.state.values.project_input.project_input_action
          .selected_option.value;

      const inputPriority =
        payload.view.state.values.priority_input.priority_input_action
          .selected_option.value;

      const projectName =
        payload.view.state.values.project_input.project_input_action
          .selected_option.text.text;

      const userSlackId = payload.user.id;
      // console.log(userSlackId);
      // console.log("------------------");
      // console.log(payload);
      // console.log("------------------------");
      // console.log("Hello baccho");
      // console.log("Selected User Id:", userId);
      // console.log("Selected Project Id:", projectId);
      // console.log(inputPriority);
      const token: string = getRequiredEnvironmentVariable("SLACK_AUTH_TOKEN");

      const postgresDatabaseManager = await getPostgresDatabaseManager(null);
      if (postgresDatabaseManager instanceof Error) {
        throw new Error("Error connecting to database");
      }

      let resultTasks;
      if (inputPriority == "ALL") {
        resultTasks = await postgresDatabaseManager.execute(
          `
            SELECT
                title,priority,status
            FROM
                tasks
            WHERE
            assigned_to = $1 AND
            project = $2 AND
            status != 'DONE' 
      `,
          [userId, projectId]
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
            project = $2 AND
            status != 'DONE' AND
            priority =$3
      `,
          [userId, projectId, inputPriority]
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

      sendSlackMessagesAllTasks(token, userSlackId, projectName, resultTasks);

      return new Response(
        JSON.stringify({
          response_action: "clear",
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } else if (payload.type === "view_closed") {
      console.log("Modal closed by user bhai");
      return new Response(null, { status: 200 });
    } else if (payload.type === "block_actions") {
      // console.log(payload)
      // console.log("Payload Type: " + payload.type);
      // console.log(
      //   "Selected User: " + payload.actions[0].selected_option.text.text
      // );
      // console.log(
      //   "Selected User id: " + payload.actions[0].selected_option.value
      // );
      // console.log("View_Id: " + payload.view.id);

      const resultProjects = await postgresDatabaseManager.execute(
        `SELECT DISTINCT projects.name,project
        FROM tasks
        JOIN projects ON projects.id = tasks.project 
        WHERE assigned_to = $1
        `,
        [payload.actions[0].selected_option.value]
      );

      if (resultProjects instanceof Error) {
        throw new Error("Error querying database");
      }

      console.log(resultProjects);
      const modalProjectInput = resultProjects.rows.map((row) => ({
        text: { type: "plain_text", text: row.name },
        value: row.project,
      }));

      const view = {
        type: "modal",
        callback_id: "list_task_modal",
        notify_on_close: true,
        title: { type: "plain_text", text: "Show Tasks List" },
        blocks: [
          {
            type: "input",
            block_id: "user_input",
            dispatch_action: true,
            element: {
              type: "static_select",
              placeholder: { type: "plain_text", text: "User Name" },
              action_id: "user_input_action",
              options: modalUserInput,
            },
            label: { type: "plain_text", text: "Select User 👨🏻‍💻" },
          },
          {
            type: "input",
            block_id: "project_input",
            element: {
              type: "static_select",
              placeholder: { type: "plain_text", text: "Project Name" },
              action_id: "project_input_action",
              options: modalProjectInput,
            },
            label: { type: "plain_text", text: "Select Project 📋" },
          },
          {
            type: "input",
            block_id: "priority_input",
            element: {
              type: "static_select",
              placeholder: {
                type: "plain_text",
                text: "Select priority",
              },
              action_id: "priority_input_action",
              options: [
                {
                  text: {
                    type: "plain_text",
                    text: "All",
                  },
                  value: "ALL",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "High",
                  },
                  value: "HIGH",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "Medium",
                  },
                  value: "MEDIUM",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "Low",
                  },
                  value: "LOW",
                },
              ],
            },
            label: {
              type: "plain_text",
              text: "Select Priority",
            },
          },
        ],
        submit: { type: "plain_text", text: "Show Task List" },
      };
      await updateModal(view, payload.view.id);
      if (action.action_id === "select_user") {
        const selectedUser = action.selected_option.value;
        const selectedUserName = action.selected_option.text.text;
        console.log("Selected User Name", selectedUserName);
        console.log("Selected User:", selectedUser);
      }
    } else {
      if (payload.callback_id == "add_task") {
        // Handle other types of payloads
        const triggerId = getStringFromUnknown(payload.trigger_id);
        // const callbackId = getStringFromUnknown(payload.callback_id);
        // console.log(payload);
        console.log("Trigger_Id: " + triggerId);
        await openModal(triggerId, {
          type: "modal",
          callback_id: "list_task_modal",
          notify_on_close: true,
          title: { type: "plain_text", text: "Show Tasks List" },
          blocks: [
            {
              type: "input",
              block_id: "user_input",
              dispatch_action: true,
              element: {
                type: "static_select",
                placeholder: { type: "plain_text", text: "User Name" },
                action_id: "user_input_action",
                options: modalUserInput,
              },
              label: { type: "plain_text", text: "Select User 👨🏻‍💻" },
            },
          ],
          submit: { type: "plain_text", text: "Show Task List" },
        });
      }
    }

    return new Response(null, { status: 200 });
  } catch (error: unknown) {
    const error_ = getErrorFromUnknown(error);
    return new Response(error_.message, { status: 500 });
  }
};
