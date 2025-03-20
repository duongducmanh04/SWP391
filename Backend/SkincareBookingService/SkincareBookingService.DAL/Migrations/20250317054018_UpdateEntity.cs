using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SkincareBookingService.DAL.Migrations
{
    /// <inheritdoc />
    public partial class UpdateEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Account",
                columns: table => new
                {
                    accountId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    accountName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    password = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    role = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    active = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Account__F267251E9E4D1C6E", x => x.accountId);
                });

            migrationBuilder.CreateTable(
                name: "QuizQuestionSet",
                columns: table => new
                {
                    questionsId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__QuizQues__E6446AF296DD0532", x => x.questionsId);
                });

            migrationBuilder.CreateTable(
                name: "Services",
                columns: table => new
                {
                    serviceId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    description = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    price = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    image = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    createdAt = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    duration = table.Column<int>(type: "int", nullable: true),
                    procedureDescription = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AverageStars = table.Column<double>(type: "float", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Services__455070DFCAF055F5", x => x.serviceId);
                });

            migrationBuilder.CreateTable(
                name: "SkinType",
                columns: table => new
                {
                    skintypeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    skintypeName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    description = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    image = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Pros = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Cons = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SkincareGuide = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    introduction = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__SkinType__4A6B74075F8CC227", x => x.skintypeId);
                });

            migrationBuilder.CreateTable(
                name: "SkinTherapist",
                columns: table => new
                {
                    skintherapistId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    speciality = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    experience = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    image = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    accountId = table.Column<int>(type: "int", nullable: true),
                    degree = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__SkinTher__AC166160E1B81E8D", x => x.skintherapistId);
                    table.ForeignKey(
                        name: "FK__SkinThera__accou__5165187F",
                        column: x => x.accountId,
                        principalTable: "Account",
                        principalColumn: "accountId");
                });

            migrationBuilder.CreateTable(
                name: "QuizQuestion",
                columns: table => new
                {
                    quizquestionId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    questionsId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__QuizQues__F5476D714DD95FEC", x => x.quizquestionId);
                    table.ForeignKey(
                        name: "FK__QuizQuest__quest__7A672E12",
                        column: x => x.questionsId,
                        principalTable: "QuizQuestionSet",
                        principalColumn: "questionsId");
                });

            migrationBuilder.CreateTable(
                name: "Customer",
                columns: table => new
                {
                    customerId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    skintypeId = table.Column<int>(type: "int", nullable: true),
                    accountId = table.Column<int>(type: "int", nullable: true),
                    phoneNumber = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    image = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Customer__B611CB7DEFF47A3D", x => x.customerId);
                    table.ForeignKey(
                        name: "FK__Customer__accoun__4E88ABD4",
                        column: x => x.accountId,
                        principalTable: "Account",
                        principalColumn: "accountId");
                    table.ForeignKey(
                        name: "FK__Customer__skinty__4D94879B",
                        column: x => x.skintypeId,
                        principalTable: "SkinType",
                        principalColumn: "skintypeId");
                });

            migrationBuilder.CreateTable(
                name: "SkintypeService",
                columns: table => new
                {
                    skintypeServiceId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    skintypeId = table.Column<int>(type: "int", nullable: true),
                    serviceId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Skintype__CC39B0BFBB6C850B", x => x.skintypeServiceId);
                    table.ForeignKey(
                        name: "FK__SkintypeS__servi__6754599E",
                        column: x => x.serviceId,
                        principalTable: "Services",
                        principalColumn: "serviceId");
                    table.ForeignKey(
                        name: "FK__SkintypeS__skint__66603565",
                        column: x => x.skintypeId,
                        principalTable: "SkinType",
                        principalColumn: "skintypeId");
                });

            migrationBuilder.CreateTable(
                name: "SkinTherapistService",
                columns: table => new
                {
                    skintherapistserviceId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    speciality = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    experience = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    skintherapistId = table.Column<int>(type: "int", nullable: true),
                    serviceId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__SkinTher__0F4BA1D27C9EA1BD", x => x.skintherapistserviceId);
                    table.ForeignKey(
                        name: "FK__SkinThera__servi__6383C8BA",
                        column: x => x.serviceId,
                        principalTable: "Services",
                        principalColumn: "serviceId");
                    table.ForeignKey(
                        name: "FK__SkinThera__skint__628FA481",
                        column: x => x.skintherapistId,
                        principalTable: "SkinTherapist",
                        principalColumn: "skintherapistId");
                });

            migrationBuilder.CreateTable(
                name: "QuizAnswer",
                columns: table => new
                {
                    answerId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    quizquestionId = table.Column<int>(type: "int", nullable: true),
                    skintypeId = table.Column<int>(type: "int", nullable: true),
                    answer = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    serviceImpact = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__QuizAnsw__6836B974A01114EA", x => x.answerId);
                    table.ForeignKey(
                        name: "FK__QuizAnswe__quizq__7F2BE32F",
                        column: x => x.quizquestionId,
                        principalTable: "QuizQuestion",
                        principalColumn: "quizquestionId");
                    table.ForeignKey(
                        name: "FK__QuizAnswe__skint__00200768",
                        column: x => x.skintypeId,
                        principalTable: "SkinType",
                        principalColumn: "skintypeId");
                });

            migrationBuilder.CreateTable(
                name: "Blog",
                columns: table => new
                {
                    blogId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    content = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    customerId = table.Column<int>(type: "int", nullable: true),
                    image = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    createAt = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Blog__FA0AA72D075819E8", x => x.blogId);
                    table.ForeignKey(
                        name: "FK__Blog__customerId__6B24EA82",
                        column: x => x.customerId,
                        principalTable: "Customer",
                        principalColumn: "customerId");
                });

            migrationBuilder.CreateTable(
                name: "Booking",
                columns: table => new
                {
                    bookingId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    customerId = table.Column<int>(type: "int", nullable: true),
                    location = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    date = table.Column<DateTime>(type: "datetime", nullable: true),
                    createAt = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    amount = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    skintherapistId = table.Column<int>(type: "int", nullable: true),
                    updateAt = table.Column<DateTime>(type: "datetime", nullable: true),
                    serviceName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    serviceId = table.Column<int>(type: "int", nullable: true),
                    note = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Booking__C6D03BCD7E8456A4", x => x.bookingId);
                    table.ForeignKey(
                        name: "FK__Booking__custome__5812160E",
                        column: x => x.customerId,
                        principalTable: "Customer",
                        principalColumn: "customerId");
                    table.ForeignKey(
                        name: "FK__Booking__skinthe__59063A47",
                        column: x => x.skintherapistId,
                        principalTable: "SkinTherapist",
                        principalColumn: "skintherapistId");
                });

            migrationBuilder.CreateTable(
                name: "CustomerSurvey",
                columns: table => new
                {
                    customersurveyId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    date = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    skintypeId = table.Column<int>(type: "int", nullable: true),
                    questionsId = table.Column<int>(type: "int", nullable: true),
                    customerId = table.Column<int>(type: "int", nullable: true),
                    createdAt = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Customer__500667325476DE3A", x => x.customersurveyId);
                    table.ForeignKey(
                        name: "FK__CustomerS__custo__06CD04F7",
                        column: x => x.customerId,
                        principalTable: "Customer",
                        principalColumn: "customerId");
                    table.ForeignKey(
                        name: "FK__CustomerS__quest__05D8E0BE",
                        column: x => x.questionsId,
                        principalTable: "QuizQuestionSet",
                        principalColumn: "questionsId");
                    table.ForeignKey(
                        name: "FK__CustomerS__skint__04E4BC85",
                        column: x => x.skintypeId,
                        principalTable: "SkinType",
                        principalColumn: "skintypeId");
                });

            migrationBuilder.CreateTable(
                name: "Rating",
                columns: table => new
                {
                    ratingId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    customerId = table.Column<int>(type: "int", nullable: false),
                    createAt = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    stars = table.Column<int>(type: "int", nullable: true),
                    serviceId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Rating__2D290CA97E0DB2B2", x => x.ratingId);
                    table.ForeignKey(
                        name: "FK_Rating_Service",
                        column: x => x.serviceId,
                        principalTable: "Services",
                        principalColumn: "serviceId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK__Rating__customer__6FE99F9F",
                        column: x => x.customerId,
                        principalTable: "Customer",
                        principalColumn: "customerId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Slot",
                columns: table => new
                {
                    slotId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    time = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    bookingId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Slot__9C4A67135BE9F5DA", x => x.slotId);
                    table.ForeignKey(
                        name: "FK__Slot__bookingId__5BE2A6F2",
                        column: x => x.bookingId,
                        principalTable: "Booking",
                        principalColumn: "bookingId");
                });

            migrationBuilder.CreateTable(
                name: "CustomerSurveyAnswer",
                columns: table => new
                {
                    customersurveyanswerId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    customersurveyId = table.Column<int>(type: "int", nullable: true),
                    answerId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Customer__7C419B23EC9362B1", x => x.customersurveyanswerId);
                    table.ForeignKey(
                        name: "FK__CustomerS__answe__0A9D95DB",
                        column: x => x.answerId,
                        principalTable: "QuizAnswer",
                        principalColumn: "answerId");
                    table.ForeignKey(
                        name: "FK__CustomerS__custo__09A971A2",
                        column: x => x.customersurveyId,
                        principalTable: "CustomerSurvey",
                        principalColumn: "customersurveyId");
                });

            migrationBuilder.CreateTable(
                name: "Schedule",
                columns: table => new
                {
                    scheduleId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    skinTherapistId = table.Column<int>(type: "int", nullable: true),
                    slotId = table.Column<int>(type: "int", nullable: true),
                    date = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Schedule__A532EDD4795F163A", x => x.scheduleId);
                    table.ForeignKey(
                        name: "FK__Schedule__skinTh__5EBF139D",
                        column: x => x.skinTherapistId,
                        principalTable: "SkinTherapist",
                        principalColumn: "skintherapistId");
                    table.ForeignKey(
                        name: "FK__Schedule__slotId__5FB337D6",
                        column: x => x.slotId,
                        principalTable: "Slot",
                        principalColumn: "slotId");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Blog_customerId",
                table: "Blog",
                column: "customerId");

            migrationBuilder.CreateIndex(
                name: "IX_Booking_customerId",
                table: "Booking",
                column: "customerId");

            migrationBuilder.CreateIndex(
                name: "IX_Booking_skintherapistId",
                table: "Booking",
                column: "skintherapistId");

            migrationBuilder.CreateIndex(
                name: "IX_Customer_accountId",
                table: "Customer",
                column: "accountId");

            migrationBuilder.CreateIndex(
                name: "IX_Customer_skintypeId",
                table: "Customer",
                column: "skintypeId");

            migrationBuilder.CreateIndex(
                name: "IX_CustomerSurvey_customerId",
                table: "CustomerSurvey",
                column: "customerId");

            migrationBuilder.CreateIndex(
                name: "IX_CustomerSurvey_questionsId",
                table: "CustomerSurvey",
                column: "questionsId");

            migrationBuilder.CreateIndex(
                name: "IX_CustomerSurvey_skintypeId",
                table: "CustomerSurvey",
                column: "skintypeId");

            migrationBuilder.CreateIndex(
                name: "IX_CustomerSurveyAnswer_answerId",
                table: "CustomerSurveyAnswer",
                column: "answerId");

            migrationBuilder.CreateIndex(
                name: "IX_CustomerSurveyAnswer_customersurveyId",
                table: "CustomerSurveyAnswer",
                column: "customersurveyId");

            migrationBuilder.CreateIndex(
                name: "IX_QuizAnswer_quizquestionId",
                table: "QuizAnswer",
                column: "quizquestionId");

            migrationBuilder.CreateIndex(
                name: "IX_QuizAnswer_skintypeId",
                table: "QuizAnswer",
                column: "skintypeId");

            migrationBuilder.CreateIndex(
                name: "IX_QuizQuestion_questionsId",
                table: "QuizQuestion",
                column: "questionsId");

            migrationBuilder.CreateIndex(
                name: "IX_Rating_customerId",
                table: "Rating",
                column: "customerId");

            migrationBuilder.CreateIndex(
                name: "IX_Rating_serviceId",
                table: "Rating",
                column: "serviceId");

            migrationBuilder.CreateIndex(
                name: "IX_Schedule_skinTherapistId",
                table: "Schedule",
                column: "skinTherapistId");

            migrationBuilder.CreateIndex(
                name: "IX_Schedule_slotId",
                table: "Schedule",
                column: "slotId");

            migrationBuilder.CreateIndex(
                name: "IX_SkinTherapist_accountId",
                table: "SkinTherapist",
                column: "accountId");

            migrationBuilder.CreateIndex(
                name: "IX_SkinTherapistService_serviceId",
                table: "SkinTherapistService",
                column: "serviceId");

            migrationBuilder.CreateIndex(
                name: "IX_SkinTherapistService_skintherapistId",
                table: "SkinTherapistService",
                column: "skintherapistId");

            migrationBuilder.CreateIndex(
                name: "IX_SkintypeService_serviceId",
                table: "SkintypeService",
                column: "serviceId");

            migrationBuilder.CreateIndex(
                name: "IX_SkintypeService_skintypeId",
                table: "SkintypeService",
                column: "skintypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Slot_bookingId",
                table: "Slot",
                column: "bookingId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Blog");

            migrationBuilder.DropTable(
                name: "CustomerSurveyAnswer");

            migrationBuilder.DropTable(
                name: "Rating");

            migrationBuilder.DropTable(
                name: "Schedule");

            migrationBuilder.DropTable(
                name: "SkinTherapistService");

            migrationBuilder.DropTable(
                name: "SkintypeService");

            migrationBuilder.DropTable(
                name: "QuizAnswer");

            migrationBuilder.DropTable(
                name: "CustomerSurvey");

            migrationBuilder.DropTable(
                name: "Slot");

            migrationBuilder.DropTable(
                name: "Services");

            migrationBuilder.DropTable(
                name: "QuizQuestion");

            migrationBuilder.DropTable(
                name: "Booking");

            migrationBuilder.DropTable(
                name: "QuizQuestionSet");

            migrationBuilder.DropTable(
                name: "Customer");

            migrationBuilder.DropTable(
                name: "SkinTherapist");

            migrationBuilder.DropTable(
                name: "SkinType");

            migrationBuilder.DropTable(
                name: "Account");
        }
    }
}
