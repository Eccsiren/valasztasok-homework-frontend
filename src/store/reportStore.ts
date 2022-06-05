import $axios from "./axios.instance";
import { defineStore } from "pinia";
import { Notify, Loading } from "quasar";

Notify.setDefaults({
  position: "bottom",
  textColor: "white",
  timeout: 3000,
  actions: [{ icon: "close", color: "white" }],
});

interface IAllVotesStat {
  sum_val?: number;
  ratio?: number;
}

interface IPartyVotesStat {
  num_of_votes?: number;
  party_short_name?: string;
  party_name?: string;
}

interface IParty {
  short_name?: string;
  full_name?: string;
}

interface IElectedCandidate {
  _id?: number;
  constituency?: string;
  number_of_votes?: number;
  name?: string;
  party?: IParty;
}

interface IConstituencyWinners {
  name?: string;
  constituency?: string;
  party_short_name?: string;
  party_full_name?: string;
}

interface IPaginatedParams {
  keyword?: string;
}

interface IFields {
  candidate_count?: number;
  all_votes_stat?: Array<IAllVotesStat>;
  candidate_num_of_votes?: number | string;
  party_votes_stat?: Array<IPartyVotesStat>;
  elected_candidate?: Array<IElectedCandidate>;
  constituency_winners?: Array<IConstituencyWinners>;
}

interface IState {
  data: IFields; // store documents (records) after get method(s)
  isLoading: boolean;
  pagination: IPaginatedParams;
}

export const useReportStore = defineStore({
  id: "reportStore",
  state: (): IState => ({
    data: {},
    isLoading: false,
    pagination: { keyword: "" },
  }),
  getters: {},
  actions: {
    async getAll(): Promise<void> {
      Loading.show();
      this.data = {};
      $axios
        .get("report")
        .then((res) => {
          Loading.hide();
          if (res && res.data) {
            this.data = res.data;
          }
        })
        .catch((error) => {
          Loading.hide();
          Notify.create({
            message: `Error (${error.response.data.status}) while get all: ${error.response.data.message}`,
            color: "negative",
          });
        });
    },
    async getPaginated(params: IPaginatedParams): Promise<void> {
      Loading.show();
      this.data = {};
      $axios
        .get(`report/${params.keyword}`)
        .then((res) => {
          Loading.hide();
          if (res && res.data) {
            this.data = res.data;
          }
        })
        .catch((error) => {
          Loading.hide();
          Notify.create({
            message: `Error (${error.response.data.status}) while get paginated: ${error.response.data.message}`,
            color: "negative",
          });
        });
    },
  },
});
