<script setup lang="ts">
  import { useCandidatesStore } from "../store/candidatesStore";
  import { storeToRefs } from "pinia";
  import router from "src/router";
  import { useUsersStore } from "../store/usersStore";

  const candidateStore = useCandidatesStore();
  const usersStore = useUsersStore();

  const { isLoading, dataN, pagination, selected } = storeToRefs(candidateStore);

  watch(isLoading, () => {
    onRequest({
      pagination: pagination.value,
    });
  });

  function deleteRecord(): void {
    candidateStore.deleteById();
  }

  function newRecord(): void {
    candidateStore.data = {};
    router.push("/newCandidate");
  }

  function filterChanged(): void {
    selected.value = [];
  }

  function editRecord(): void {
    candidateStore.data = selected.value[0];
    candidateStore.getById();
    router.push("/editCandidate");
  }

  function clearSelection(): void {
    selected.value = [];
  }

  const columns: any[] = [
    { name: "_id", label: "_id", field: "_id", align: "left", sortable: true },
    { name: "name", label: "Név", field: "name", align: "left", sortable: true },
    {
      name: "party_short",
      label: "Párt rövidítés",
      field: (row: any) => row.party.short_name,
      align: "center",
    },
    {
      name: "party_full",
      label: "Párt",
      field: (row: any) => row.party.full_name,
      align: "center",
    },
    {
      name: "constituency",
      label: "Választókerület",
      field: "constituency",
      align: "left",
      sortable: true,
    },
    {
      name: "number_of_votes",
      label: "Szavazatok száma",
      field: "number_of_votes",
      align: "left",
      sortable: true,
    },
  ];

  function onRequest(props: any) {
    const { page, rowsPerPage, sortBy, descending, filter } = props.pagination;

    candidateStore.fetchPaginatedCandidates({
      offset: (page - 1) * rowsPerPage,
      limit: rowsPerPage,
      order: sortBy,
      sort: descending ? "-1" : "1",
      keyword: filter,
    });

    // don't forget to update local pagination object
    pagination.value.page = page;
    pagination.value.rowsPerPage = rowsPerPage;
    pagination.value.sortBy = sortBy;
    pagination.value.descending = descending;
  }

  onMounted(() => {
    onRequest({
      pagination: pagination.value,
    });
  });
</script>

<template>
  <q-page>
    <div class="q-pa-md">
      <q-table
        v-model:pagination="pagination"
        v-model:selected="selected"
        binary-state-sort
        :columns="columns"
        dense
        :filter="pagination.filter"
        row-key="_id"
        :rows="dataN"
        selection="multiple"
        title="Candidates"
        wrap-cells
        @request="onRequest"
      >
        <template #top-right>
          <q-input
            v-model="pagination.filter"
            debounce="300"
            dense
            @update:model-value="filterChanged()"
          >
            <template #append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
      </q-table>
      <!-- Buttons:  -->
      <div class="row justify-center q-ma-sm q-gutter-sm">
        <q-btn v-show="selected.length != 0" color="orange" no-caps @click="clearSelection">
          {{ selected.length > 1 ? "Clear selections" : "Clear selection" }}
        </q-btn>
        <q-btn
          v-show="usersStore.loggedUser && selected.length == 0"
          color="green"
          no-caps
          @click="newRecord"
        >
          New record
        </q-btn>
        <q-btn v-show="selected.length == 1" color="blue" no-caps @click="editRecord">
          Edit record
        </q-btn>
        <q-btn v-show="selected.length != 0" color="red" no-caps @click="deleteRecord">
          {{ selected.length > 1 ? "Delete selected records" : "Delete selected record" }}
        </q-btn>
      </div>
      <!-- <p>Pagination object: {{ pagination }}</p> -->
      <!-- <p>Selected array: {{ selected }}</p> -->
      <!-- <div>Filter: "{{ pagination.filter }}"</div> -->
    </div>
  </q-page>
</template>

<style scoped></style>
