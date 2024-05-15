using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "Users");

            migrationBuilder.CreateTable(
                name: "Categories",
                schema: "Users",
                columns: table => new
                {
                    CategoryId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.CategoryId);
                });

            migrationBuilder.CreateTable(
                name: "Tags",
                schema: "Users",
                columns: table => new
                {
                    TagId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tags", x => x.TagId);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                schema: "Users",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Username = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Role = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserId);
                });

            migrationBuilder.CreateTable(
                name: "Collections",
                schema: "Users",
                columns: table => new
                {
                    CollectionId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ImageURL = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    CategoryID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Collections", x => x.CollectionId);
                    table.ForeignKey(
                        name: "FK_Collections_Categories_CategoryID",
                        column: x => x.CategoryID,
                        principalSchema: "Users",
                        principalTable: "Categories",
                        principalColumn: "CategoryId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Collections_Users_UserID",
                        column: x => x.UserID,
                        principalSchema: "Users",
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Fields",
                schema: "Users",
                columns: table => new
                {
                    FieldId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Type = table.Column<int>(type: "int", nullable: false),
                    State = table.Column<int>(type: "int", nullable: false),
                    CollectionID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Fields", x => x.FieldId);
                    table.ForeignKey(
                        name: "FK_Fields_Collections_CollectionID",
                        column: x => x.CollectionID,
                        principalSchema: "Users",
                        principalTable: "Collections",
                        principalColumn: "CollectionId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Items",
                schema: "Users",
                columns: table => new
                {
                    ItemId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Tags = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CollectionID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Items", x => x.ItemId);
                    table.ForeignKey(
                        name: "FK_Items_Collections_CollectionID",
                        column: x => x.CollectionID,
                        principalSchema: "Users",
                        principalTable: "Collections",
                        principalColumn: "CollectionId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CustomField",
                schema: "Users",
                columns: table => new
                {
                    CustomFieldId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Type = table.Column<int>(type: "int", nullable: false),
                    ItemId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomField", x => x.CustomFieldId);
                    table.ForeignKey(
                        name: "FK_CustomField_Items_ItemId",
                        column: x => x.ItemId,
                        principalSchema: "Users",
                        principalTable: "Items",
                        principalColumn: "ItemId");
                });

            migrationBuilder.CreateTable(
                name: "ItemCustomFields",
                schema: "Users",
                columns: table => new
                {
                    ItemId = table.Column<int>(type: "int", nullable: false),
                    CustomFieldId = table.Column<int>(type: "int", nullable: false),
                    FieldValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItemCustomFields", x => new { x.ItemId, x.CustomFieldId });
                    table.ForeignKey(
                        name: "FK_ItemCustomFields_CustomField_CustomFieldId",
                        column: x => x.CustomFieldId,
                        principalSchema: "Users",
                        principalTable: "CustomField",
                        principalColumn: "CustomFieldId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ItemCustomFields_Items_ItemId",
                        column: x => x.ItemId,
                        principalSchema: "Users",
                        principalTable: "Items",
                        principalColumn: "ItemId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Collections_CategoryID",
                schema: "Users",
                table: "Collections",
                column: "CategoryID");

            migrationBuilder.CreateIndex(
                name: "IX_Collections_UserID",
                schema: "Users",
                table: "Collections",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_CustomField_ItemId",
                schema: "Users",
                table: "CustomField",
                column: "ItemId");

            migrationBuilder.CreateIndex(
                name: "IX_Fields_CollectionID",
                schema: "Users",
                table: "Fields",
                column: "CollectionID");

            migrationBuilder.CreateIndex(
                name: "IX_ItemCustomFields_CustomFieldId",
                schema: "Users",
                table: "ItemCustomFields",
                column: "CustomFieldId");

            migrationBuilder.CreateIndex(
                name: "IX_Items_CollectionID",
                schema: "Users",
                table: "Items",
                column: "CollectionID");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                schema: "Users",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Username",
                schema: "Users",
                table: "Users",
                column: "Username",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Fields",
                schema: "Users");

            migrationBuilder.DropTable(
                name: "ItemCustomFields",
                schema: "Users");

            migrationBuilder.DropTable(
                name: "Tags",
                schema: "Users");

            migrationBuilder.DropTable(
                name: "CustomField",
                schema: "Users");

            migrationBuilder.DropTable(
                name: "Items",
                schema: "Users");

            migrationBuilder.DropTable(
                name: "Collections",
                schema: "Users");

            migrationBuilder.DropTable(
                name: "Categories",
                schema: "Users");

            migrationBuilder.DropTable(
                name: "Users",
                schema: "Users");
        }
    }
}
