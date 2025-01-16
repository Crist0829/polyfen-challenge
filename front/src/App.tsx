import Welcome from "@/pages/Welcome";
import { Redirect, Route, Switch } from "wouter";
import Prospects from "./pages/Prospects";
import PageNotFound from "./pages/PageNotFound";

function App() {
  return (
    <div className=" min-h-dvh w-10/12 mx-auto">
      <Switch>
        <Route path="/">
          <Redirect to="/prospects" />
        </Route>

        <Route path="/prospects" component={Prospects} />
        <Route path="/prospects/upload" component={Welcome} />

        <Route component={PageNotFound} />
      </Switch>
    </div>
  );
}

export default App;
