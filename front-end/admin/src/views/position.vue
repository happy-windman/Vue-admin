<template>
  <div>
    <Table border :columns="columns7" :data="data6">
      <div slot="header">
        <Button @click="handleAdd" type="success" style="margin:10px;">添加职位</Button>
      </div>
    </Table>
    <Page
      :total="total"
      :page-size="pageSize"
      :page-size-opts="pageSizeOpts"
      :show-sizer="true"
      @on-change="handleChange"
      @on-page-size-change="pageChange"
      placement="top"
      style="margin-top:20px;float:right;"
    />
    <Modal
      v-model="modal"
      :title="addOrUpdate=='add'?'添加职位':'修改职位'"
      @on-ok="ok('formItem')"
      @on-cancel="cancel"
      width="800"
      :loading="loading"
    >
      <Form :model="formItem" :label-width="100" label-colon :rules="ruleForm" ref="formItem">
        <FormItem label="公司Logo" prop="companyLogo">
          <Upload
            :before-upload="handleUpload"
            action="/api/position/upload"
            name="companyLogo"
            :on-success="handleSucc"
          >
            <Button icon="ios-cloud-upload-outline">Select the file to upload</Button>
          </Upload>
          <div v-if="file !== null">
            <img :src="insideSrc" width="100px" height="50px" />
          </div>
        </FormItem>
        <FormItem label="公司名称" prop="companyName">
          <Input v-model="formItem.companyName" placeholder="Enter something..." />
        </FormItem>
        <FormItem label="职位名称" prop="positionName">
          <Input v-model="formItem.positionName" placeholder="Enter something..." />
        </FormItem>
        <FormItem label="城市" prop="city">
          <Input v-model="formItem.city" placeholder="Enter something..." />
        </FormItem>
        <FormItem label="工作经验" prop="experience">
          <Select v-model="formItem.experience">
            <Option value="0">应届生</Option>
            <Option value="1-3">1-3年</Option>
            <Option value="3-5">3-5年</Option>
            <Option value="5<">5年以上</Option>
          </Select>
        </FormItem>
        <FormItem label="学历" prop="education">
          <Select v-model="formItem.education">
            <Option value="初高中">初高中</Option>
            <Option value="专科">专科</Option>
            <Option value="本科">本科</Option>
            <Option value="研究生">研究生</Option>
          </Select>
        </FormItem>
        <FormItem label="薪资" prop="salary">
          <Input v-model="formItem.salary" placeholder="Enter something..." />
        </FormItem>
        <FormItem label="DatePicker">
          <Row>
            <Col span="11">
              <DatePicker
                type="date"
                placeholder="Select date"
                :value="date"
                @on-change="handleDateChange"
              ></DatePicker>
            </Col>
            <Col span="2" style="text-align: center">-</Col>
            <Col span="11">
              <TimePicker
                type="time"
                placeholder="Select time"
                :value="time"
                @on-change="handleTimeChange"
              ></TimePicker>
            </Col>
          </Row>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>

import { get, post, getOne } from "../utils/http";
import _ from "lodash";
import moment from "moment";
export default {
  
  inject: ['reload'],
  data() {
    return {
      addOrUpdate: "",
      columns7: [
        {
          title: "id",
          key: "_id"
        },
        {
          title: "公司名称",
          key: "companyName",
          render: (h, params) => {
            return h("div", [
              h("Icon", {
                props: {
                  type: "person"
                }
              }),
              h("strong", params.row.companyName)
            ]);
          }
        },
        {
          title: "公司LOGO",
          key: "companyLogo",
          width: "200px",
          className: "pic",
          render: (h, params) => {
            return h("img", {
              attrs: {
                src: "http://localhost:3000/uploads/" + params.row.companyLogo
                // style: "width:100%"
              }
            });
          }
        },
        {
          title: "职位名称",
          key: "positionName"
        },
        {
          title: "城市",
          key: "city"
        },
        {
          title: "工作经验",
          key: "experience"
        },
        {
          title: "学历",
          key: "education"
        },
        {
          title: "薪水",
          key: "salary"
        },

        {
          title: "管理",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      console.log(params.row);
                      this.update(params.row);
                    }
                  }
                },
                "修改"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.remove(params.row);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      ruleForm: {
        companyName: [
          {
            required: true,
            message: "The name cannot be empty",
            trigger: "blur"
          }
        ],
        companyLogo: [
          {
            required: true,
            message: "Mailbox cannot be empty",
            trigger: "blur"
          }
        ],
        city: [
          { required: true, message: "Please select the city", trigger: "blur" }
        ],
        positionName: [
          { required: true, message: "Please select gender", trigger: "blur" }
        ],
        salary: [
          {
            required: true,
            message: "Choose at least one hobby",
            trigger: "blur"
          }
        ],
        dateTime: [
          {
            required: true,
            message: "Please select the date",
            trigger: "change"
          }
        ],
        education: [
          { required: true, message: "Please select time", trigger: "change" }
        ],
        experience: [
          {
            required: true,
            message: "Please enter a personal introduction",
            trigger: "change"
          }
        ]
      },
      data6: [],
      all: [],
      total: 0,
      pageNo: 1,
      pageSize: 10,
      pageSizeOpts: [5, 10, 20],
      modal: false,
      formItem: {
        positionName: "",
        companyName: "",
        companyLogo: "",
        city: "",
        experience: "",
        education: "",
        salary: "",
        dateTime: ""
      },
      time: new Date(),
      date: new Date(),
      file: null,
      insideSrc: "",
      loadingStatus: false,
      loading: true
    };
  },
  methods: {
    async update({ _id }) {
      let result = await getOne({
        url: "/api/position/findOne",
        params: {
          id: _id
        }
      });
      let {
        positionName,
        companyName,
        companyLogo,
        city,
        experience,
        education,
        salary,
        dateTime
      } = result;
      (this.formItem = {
        positionName,
        companyName,
        companyLogo,
        city,
        experience,
        education,
        salary,
        dateTime,
        id: _id
      }),
        (this.addOrUpdate = "update");
      this.modal = true;
    },
    handleAdd() {
      this.addOrUpdate = "add";
      this.formItem = {
        positionName: "",
        companyName: "",
        companyLogo: "",
        city: "",
        experience: "",
        education: "",
        salary: "",
        dateTime: ""
      }
      this.modal = true;
    },
    async remove({ _id, companyLogo, index }) {
      let result = await post({
        method: "delete",
        url: "/api/position/",
        data: {
          id: _id,
          companyLogo: companyLogo
        }
      });
      if (result.ret) {
        this.$Notice.success({
          title: "删除成功",
          desc: "成功删除一条数据！"
        });
        this.data6.splice(index, 1);
      }
    },
    handleChange(pageNo) {
      this.pageNo = pageNo;
    },
    pageChange(count) {
      this.pageSize = count;
    },

    async ok(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          if (this.formItem.dateTime === "") {
            this.formItem.dateTime = moment().format("YYYY-MM-DD, HH:mm:ss");
          }
          let result = null;
          if (this.addOrUpdate == "add") {
            result = await post({
              method: "post",
              url: "/api/position/",
              data: this.formItem
            });
            if (result.ret)
              this.$Notice.success({
                title: "添加成功",
                desc: "恭喜成功加入一条数据！"
              });
              // this.$route.path='/position'
              // this.$router.push(`/position?${new Date().getTime()}`)
              this.reload();
              this.modal=false
          } else {
            result = await post({
              method: "patch",
              url: "/api/position/",
              data: this.formItem
            });
            if (result.ret)
              this.$Notice.success({
                title: "修改成功",
                desc: "恭喜成功修改一条数据！"
              });
              this.modal=false
          }
          this.file = null;
        } else {
          this.loading = false;
          this.$nextTick(() => {
            this.loading = true;
          });
          this.$Message.error("Fail!");
        }
      });
    },

    cancel() {},
    handleUpload(file) {
      this.file = file;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = event => {
        this.insideSrc = event.srcElement.result;
      };
    },
    upload() {
      this.loadingStatus = true;
      setTimeout(() => {
        this.file = null;
        this.loadingStatus = false;
        this.$Notice.success({
          title: "添加成功",
          desc: "成功加入一张图片！"
        });
      }, 1500);
    },
    handleSucc(response) {
      if (response.ret) {
        this.formItem.companyLogo = response.data.filename;
      } else {
        this.$Notice.error({
          title: "添加失败",
          desc: "请检查图片格式或文件大小！"
        });
      }
    },
    handleDateChange(date) {
      this.formItem.dateTime = date + this.time;
    },
    handleTimeChange(time) {
      this.formItem.dateTime = this.date + time;
    }
  },
  watch: {
    pageNo() {
      this.data6 = _.chunk(this.all, this.pageSize)[this.pageNo - 1];
    },
    pageSize() {
      this.data6 = _.chunk(this.all, this.pageSize)[this.pageNo - 1];
    }
  },
  async mounted() {
    console.log( )
    let result = await get("/api/position/findAll");

    this.total = result.total;
    this.all = [...result.list];
    this.data6 = _.chunk(this.all, this.pageSize)[this.pageNo - 1];
  }
};
</script>
<style  lang='stylus' >
.pic
  background red
  img
    width 100%
</style>