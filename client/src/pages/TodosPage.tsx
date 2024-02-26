import "src/components/rte/styles.scss";

import { TodoDocument } from "@server/models/todo.model";
import { Collapse, List } from "antd";
import SimpleTodoCard from "src/components/todo/SimpleTodoCard";
import useTodoStore from "src/stores/todos.store";
import { useToken } from "src/utils/antd_components";
import { todoExtensions } from "src/components/todo/TodoExtensions";
import CreateTask from "src/components/todo/CreateTodo";

const TodosPage = () => {
  const [todos, loading] = useTodoStore((state) => [
    state.todos,
    state.loading,
  ]);
  const { token } = useToken();

  const { completedTodos, notCompletedTodos } = todos.reduce(
    (acc, todo) => {
      if (todo.completed) {
        acc.completedTodos.push(todo);
      } else {
        acc.notCompletedTodos.push(todo);
      }
      return acc;
    },
    {
      completedTodos: [] as TodoDocument[],
      notCompletedTodos: [] as TodoDocument[],
    }
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100svh - 102px)",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <List
          dataSource={notCompletedTodos}
          loading={loading}
          style={{
            maxWidth: "850px",
            width: "calc(100% - 20px)",
          }}
          grid={{
            xs: 1,
            column: 1,
          }}
          rowKey={(todo) => todo._id}
          renderItem={(todo) => (
            <List.Item>
              <SimpleTodoCard
                todo={todo}
                extensions={todoExtensions}
                allowEdit
              />
            </List.Item>
          )}
        />
        {completedTodos && completedTodos.length > 0 && (
          <Collapse
            style={{
              width: "calc(100% - 20px)",
              maxWidth: "850px",
              marginLeft: "-20px",
            }}
            ghost
            bordered={false}
            size="small"
            items={[
              {
                key: "1",
                label: "Completed",
                children: (
                  <List
                    dataSource={completedTodos}
                    loading={loading}
                    grid={{
                      xs: 1,
                      column: 1,
                    }}
                    renderItem={(todo) => (
                      <List.Item>
                        <SimpleTodoCard
                          todo={todo}
                          extensions={todoExtensions}
                          allowEdit
                        />
                      </List.Item>
                    )}
                  />
                ),
              },
            ]}
          />
        )}
      </div>
      <div
        style={{
          width: "100%",
          maxWidth: "850px",
          alignSelf: "center",
          boxShadow: `0px 0px 20px 10px ${token.colorBgLayout}`,
          zIndex: 100,
        }}
      >
        <CreateTask />
      </div>
    </div>
  );
};

export default TodosPage;
