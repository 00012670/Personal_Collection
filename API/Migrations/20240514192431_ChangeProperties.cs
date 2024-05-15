using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class ChangeProperties : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CustomField_Items_ItemId",
                schema: "Users",
                table: "CustomField");

            migrationBuilder.DropForeignKey(
                name: "FK_ItemCustomFields_CustomField_CustomFieldId",
                schema: "Users",
                table: "ItemCustomFields");

            migrationBuilder.DropTable(
                name: "Fields",
                schema: "Users");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CustomField",
                schema: "Users",
                table: "CustomField");

            migrationBuilder.DropColumn(
                name: "Tags",
                schema: "Users",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "ImageURL",
                schema: "Users",
                table: "Collections");

            migrationBuilder.RenameTable(
                name: "CustomField",
                schema: "Users",
                newName: "CustomFields",
                newSchema: "Users");

            migrationBuilder.RenameColumn(
                name: "FieldValue",
                schema: "Users",
                table: "ItemCustomFields",
                newName: "Value");

            migrationBuilder.RenameIndex(
                name: "IX_CustomField_ItemId",
                schema: "Users",
                table: "CustomFields",
                newName: "IX_CustomFields_ItemId");

            migrationBuilder.AddColumn<int>(
                name: "CollectionID",
                schema: "Users",
                table: "CustomFields",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_CustomFields",
                schema: "Users",
                table: "CustomFields",
                column: "CustomFieldId");

            migrationBuilder.CreateTable(
                name: "ItemTags",
                schema: "Users",
                columns: table => new
                {
                    ItemId = table.Column<int>(type: "int", nullable: false),
                    TagId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItemTags", x => new { x.ItemId, x.TagId });
                    table.ForeignKey(
                        name: "FK_ItemTags_Items_ItemId",
                        column: x => x.ItemId,
                        principalSchema: "Users",
                        principalTable: "Items",
                        principalColumn: "ItemId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ItemTags_Tags_TagId",
                        column: x => x.TagId,
                        principalSchema: "Users",
                        principalTable: "Tags",
                        principalColumn: "TagId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CustomFields_CollectionID",
                schema: "Users",
                table: "CustomFields",
                column: "CollectionID");

            migrationBuilder.CreateIndex(
                name: "IX_ItemTags_TagId",
                schema: "Users",
                table: "ItemTags",
                column: "TagId");

            migrationBuilder.AddForeignKey(
                name: "FK_CustomFields_Collections_CollectionID",
                schema: "Users",
                table: "CustomFields",
                column: "CollectionID",
                principalSchema: "Users",
                principalTable: "Collections",
                principalColumn: "CollectionId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CustomFields_Items_ItemId",
                schema: "Users",
                table: "CustomFields",
                column: "ItemId",
                principalSchema: "Users",
                principalTable: "Items",
                principalColumn: "ItemId");

            migrationBuilder.AddForeignKey(
                name: "FK_ItemCustomFields_CustomFields_CustomFieldId",
                schema: "Users",
                table: "ItemCustomFields",
                column: "CustomFieldId",
                principalSchema: "Users",
                principalTable: "CustomFields",
                principalColumn: "CustomFieldId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CustomFields_Collections_CollectionID",
                schema: "Users",
                table: "CustomFields");

            migrationBuilder.DropForeignKey(
                name: "FK_CustomFields_Items_ItemId",
                schema: "Users",
                table: "CustomFields");

            migrationBuilder.DropForeignKey(
                name: "FK_ItemCustomFields_CustomFields_CustomFieldId",
                schema: "Users",
                table: "ItemCustomFields");

            migrationBuilder.DropTable(
                name: "ItemTags",
                schema: "Users");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CustomFields",
                schema: "Users",
                table: "CustomFields");

            migrationBuilder.DropIndex(
                name: "IX_CustomFields_CollectionID",
                schema: "Users",
                table: "CustomFields");

            migrationBuilder.DropColumn(
                name: "CollectionID",
                schema: "Users",
                table: "CustomFields");

            migrationBuilder.RenameTable(
                name: "CustomFields",
                schema: "Users",
                newName: "CustomField",
                newSchema: "Users");

            migrationBuilder.RenameColumn(
                name: "Value",
                schema: "Users",
                table: "ItemCustomFields",
                newName: "FieldValue");

            migrationBuilder.RenameIndex(
                name: "IX_CustomFields_ItemId",
                schema: "Users",
                table: "CustomField",
                newName: "IX_CustomField_ItemId");

            migrationBuilder.AddColumn<string>(
                name: "Tags",
                schema: "Users",
                table: "Items",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImageURL",
                schema: "Users",
                table: "Collections",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_CustomField",
                schema: "Users",
                table: "CustomField",
                column: "CustomFieldId");

            migrationBuilder.CreateTable(
                name: "Fields",
                schema: "Users",
                columns: table => new
                {
                    FieldId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CollectionID = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    State = table.Column<int>(type: "int", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false)
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

            migrationBuilder.CreateIndex(
                name: "IX_Fields_CollectionID",
                schema: "Users",
                table: "Fields",
                column: "CollectionID");

            migrationBuilder.AddForeignKey(
                name: "FK_CustomField_Items_ItemId",
                schema: "Users",
                table: "CustomField",
                column: "ItemId",
                principalSchema: "Users",
                principalTable: "Items",
                principalColumn: "ItemId");

            migrationBuilder.AddForeignKey(
                name: "FK_ItemCustomFields_CustomField_CustomFieldId",
                schema: "Users",
                table: "ItemCustomFields",
                column: "CustomFieldId",
                principalSchema: "Users",
                principalTable: "CustomField",
                principalColumn: "CustomFieldId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
